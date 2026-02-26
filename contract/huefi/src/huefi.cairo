// ============================================================
// HueFi Game Contract v2 — 4-color, STRK staking, Sepolia
// ============================================================
// 1️⃣ EVENTS
// ============================================================

#[starknet::interface]
pub trait IHueFiEvents<TContractState> {
    fn game_played(
        ref self: TContractState,
        player: starknet::ContractAddress,
        chosen_color: u8,
        random_color: u8,
        stake: u256,
        won: bool,
    );

    fn funds_withdrawn(ref self: TContractState, owner: starknet::ContractAddress, amount: u256);

    fn ownership_transferred(
        ref self: TContractState,
        previous_owner: starknet::ContractAddress,
        new_owner: starknet::ContractAddress,
    );
}

// ============================================================
// 2️⃣ ERC20 Interface
// ============================================================

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer_from(
        ref self: TContractState,
        sender: starknet::ContractAddress,
        recipient: starknet::ContractAddress,
        amount: u256,
    );

    fn transfer(ref self: TContractState, recipient: starknet::ContractAddress, amount: u256);

    fn balance_of(self: @TContractState, account: starknet::ContractAddress) -> u256;
}

// ============================================================
// 3️⃣ HueFi Interface
// ============================================================

#[starknet::interface]
pub trait IHueFi<TContractState> {
    fn play(ref self: TContractState, chosen_color: u8, stake: u256);

    fn get_last_result(self: @TContractState, player: starknet::ContractAddress) -> u8;

    fn get_games_played(self: @TContractState, player: starknet::ContractAddress) -> u64;

    fn withdraw_funds(ref self: TContractState, amount: u256);

    fn transfer_ownership(ref self: TContractState, new_owner: starknet::ContractAddress);

    fn get_contract_balance(self: @TContractState) -> u256;

    fn get_owner(self: @TContractState) -> starknet::ContractAddress;
}

// ============================================================
// 4️⃣ CONTRACT
// ============================================================

#[starknet::contract]
mod HueFi {
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::{IERC20Dispatcher, IERC20DispatcherTrait, IHueFi};

    // =========================
    // STORAGE
    // =========================
    #[storage]
    struct Storage {
        usdc: ContractAddress,
        games_played: Map<ContractAddress, u64>,
        last_result: Map<ContractAddress, u8>,
        owner: ContractAddress,
        paused: bool,
        nonce: u64,
        version: u8,
    }

    // =========================
    // CONSTRUCTOR
    // =========================
    #[constructor]
    fn constructor(ref self: ContractState, usdc_address: ContractAddress) {
        let deployer = get_caller_address();
        self.usdc.write(usdc_address);
        self.owner.write(deployer);
        self.paused.write(false);
        self.nonce.write(0);
        self.version.write(2);
    }

    // =========================
    // INTERNAL RANDOMNESS (Improved)
    // =========================
    fn generate_random_color(nonce: u64, player: ContractAddress, stake: u256) -> u8 {
        // Combine multiple sources for better randomness
        let player_felt: felt252 = player.into();
        let player_low: u256 = player_felt.into();
        let combined = nonce.into() + player_low + stake;
        ((combined % 4_u256).low % 4_u128).try_into().unwrap()
    }

    // =========================
    // MODIFIERS
    // =========================
    fn only_owner(self: @ContractState) -> ContractAddress {
        let caller = get_caller_address();
        let owner = self.owner.read();
        assert(caller == owner, 'Only owner');
        owner
    }

    fn when_not_paused(self: @ContractState) {
        assert(!self.paused.read(), 'Contract paused');
    }

    // =========================
    // IMPLEMENTATION
    // =========================
    #[abi(embed_v0)]
    impl HueFiImpl of IHueFi<ContractState> {
        fn play(ref self: ContractState, chosen_color: u8, stake: u256) {
            // ---------- Modifiers ----------
            when_not_paused(@self);

            let player = get_caller_address();
            let contract_address = get_contract_address();

            // ---------- Validations ----------
            assert(chosen_color < 4_u8, 'Invalid color');
            assert(stake > 0_u256, 'Stake must be > 0');

            // Overflow protection
            let max_stake = 340282366920938463463374607431768211455_u256; // u256::MAX / 2
            assert(stake <= max_stake, 'Stake too large');

            let usdc = self.usdc.read();
            let mut usdc_contract = IERC20Dispatcher { contract_address: usdc };

            // ---------- Solvency Check ----------
            let balance = usdc_contract.balance_of(contract_address);
            let potential_winnings = stake * 2_u256;
            assert(balance >= potential_winnings, 'House insolvent');

            // ---------- Pull Stake ----------
            usdc_contract.transfer_from(player, contract_address, stake);

            // ---------- Random Resolution ----------
            let current_nonce = self.nonce.read();
            let random_color = generate_random_color(current_nonce, player, stake);
            self.nonce.write(current_nonce + 1);

            let mut won: bool = false;
            if random_color == chosen_color {
                won = true;

                // ---------- Pay Winner ----------
                usdc_contract.transfer(player, potential_winnings);
            }

            // ---------- Update Stats ----------
            let played = self.games_played.read(player);
            self.games_played.write(player, played + 1);
            self.last_result.write(player, if won {
                1_u8
            } else {
                0_u8
            });

            // ---------- Emit Event ----------
            self.emit(GamePlayed { player, chosen_color, random_color, stake, won });
        }

        fn get_last_result(self: @ContractState, player: ContractAddress) -> u8 {
            self.last_result.read(player)
        }

        fn get_games_played(self: @ContractState, player: ContractAddress) -> u64 {
            self.games_played.read(player)
        }

        fn withdraw_funds(ref self: ContractState, amount: u256) {
            let owner = only_owner(@self);
            let contract_address = get_contract_address();

            assert(amount > 0_u256, 'Amount must be > 0');

            let usdc = self.usdc.read();
            let mut usdc_contract = IERC20Dispatcher { contract_address: usdc };

            let balance = usdc_contract.balance_of(contract_address);
            assert(balance >= amount, 'Insufficient balance');

            usdc_contract.transfer(owner, amount);

            self.emit(FundsWithdrawn { owner, amount });
        }

        fn transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
            let current_owner = only_owner(@self);
            assert(new_owner.into() != 0, 'Invalid new owner');
            assert(new_owner != current_owner, 'Same owner');

            self.owner.write(new_owner);

            self.emit(OwnershipTransferred { previous_owner: current_owner, new_owner });
        }

        fn get_contract_balance(self: @ContractState) -> u256 {
            let contract_address = get_contract_address();
            let usdc = self.usdc.read();
            let usdc_contract = IERC20Dispatcher { contract_address: usdc };
            usdc_contract.balance_of(contract_address)
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        GamePlayed: GamePlayed,
        FundsWithdrawn: FundsWithdrawn,
        OwnershipTransferred: OwnershipTransferred,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GamePlayed {
        player: ContractAddress,
        chosen_color: u8,
        random_color: u8,
        stake: u256,
        won: bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct FundsWithdrawn {
        owner: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct OwnershipTransferred {
        previous_owner: ContractAddress,
        new_owner: ContractAddress,
    }
}
