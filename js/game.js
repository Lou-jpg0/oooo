function gameData() {
    return {
        // 玩家狀態
        player: {
            level: 1,
            hp: 100,
            maxHp: 100,
            exp: 0,
            nextLevelExp: 100,
            gold: 0,
            attack: 10,
            defense: 5
        },

        // 遊戲狀態
        currentLocation: "新手村",
        currentMessage: "歡迎來到異世界！你現在正在新手村。",
        showBattle: false,
        currentEnemy: null,

        // 可用動作
        availableActions: [
            { id: 'explore', name: '探索' },
            { id: 'rest', name: '休息' },
            { id: 'shop', name: '商店' },
            { id: 'status', name: '狀態' }
        ],

        // 敵人清單
        enemies: [
            { name: "史萊姆", hp: 30, maxHp: 30, attack: 5, exp: 20, gold: 10 },
            { name: "哥布林", hp: 45, maxHp: 45, attack: 8, exp: 35, gold: 15 },
            { name: "狼人", hp: 60, maxHp: 60, attack: 12, exp: 50, gold: 25 }
        ],

        // 初始化
        init() {
            this.updateMessage("歡迎來到異世界！你現在正在新手村。");
        },

        // 更新訊息
        updateMessage(message) {
            this.currentMessage = message;
        },

        // 執行動作
        executeAction(actionId) {
            switch(actionId) {
                case 'explore':
                    this.explore();
                    break;
                case 'rest':
                    this.rest();
                    break;
                case 'shop':
                    this.openShop();
                    break;
                case 'status':
                    this.showStatus();
                    break;
            }
        },

        // 探索
        explore() {
            if (this.showBattle) return;

            const random = Math.random();
            if (random < 0.7) { // 70% 機率遇到敵人
                this.startBattle();
            } else {
                const items = ["藥水", "金幣", "裝備"];
                const item = items[Math.floor(Math.random() * items.length)];
                this.updateMessage(`你發現了一個 ${item}！`);
                if (item === "金幣") {
                    const gold = Math.floor(Math.random() * 20) + 10;
                    this.player.gold += gold;
                    this.updateMessage(`你獲得了 ${gold} 金幣！`);
                }
            }
        },

        // 開始戰鬥
        startBattle() {
            const enemy = {...this.enemies[Math.floor(Math.random() * this.enemies.length)]};
            this.currentEnemy = enemy;
            this.showBattle = true;
            this.updateMessage(`你遇到了 ${enemy.name}！`);
        },

        // 攻擊
        attack() {
            if (!this.currentEnemy) return;

            // 玩家攻擊
            const playerDamage = Math.max(1, this.player.attack - Math.random() * 3);
            this.currentEnemy.hp -= Math.floor(playerDamage);
            this.updateMessage(`你對 ${this.currentEnemy.name} 造成了 ${Math.floor(playerDamage)} 點傷害！`);

            // 檢查敵人是否被打敗
            if (this.currentEnemy.hp <= 0) {
                this.victory();
                return;
            }

            // 敵人反擊
            setTimeout(() => {
                const enemyDamage = Math.max(1, this.currentEnemy.attack - this.player.defense - Math.random() * 3);
                this.player.hp -= Math.floor(enemyDamage);
                this.updateMessage(`${this.currentEnemy.name} 對你造成了 ${Math.floor(enemyDamage)} 點傷害！`);

                // 檢查玩家是否戰敗
                if (this.player.hp <= 0) {
                    this.defeat();
                }
            }, 1000);
        },

        // 勝利
        victory() {
            this.player.exp += this.currentEnemy.exp;
            this.player.gold += this.currentEnemy.gold;
            this.updateMessage(`你打敗了 ${this.currentEnemy.name}！獲得 ${this.currentEnemy.exp} 經驗值和 ${this.currentEnemy.gold} 金幣！`);
            this.showBattle = false;
            this.currentEnemy = null;
            this.checkLevelUp();
        },

        // 戰敗
        defeat() {
            this.updateMessage("你被打敗了！將被傳送回新手村...");
            this.player.hp = this.player.maxHp;
            this.player.gold = Math.floor(this.player.gold * 0.7); // 損失30%金幣
            this.showBattle = false;
            this.currentEnemy = null;
        },

        // 檢查升級
        checkLevelUp() {
            if (this.player.exp >= this.player.nextLevelExp) {
                this.player.level++;
                this.player.exp -= this.player.nextLevelExp;
                this.player.nextLevelExp = Math.floor(this.player.nextLevelExp * 1.5);
                this.player.maxHp += 20;
                this.player.hp = this.player.maxHp;
                this.player.attack += 5;
                this.player.defense += 3;
                this.updateMessage(`恭喜升級！你現在是 ${this.player.level} 級了！`);
            }
        },

        // 休息
        rest() {
            if (this.showBattle) return;
            if (this.player.gold < 10) {
                this.updateMessage("休息需要 10 金幣，你的金幣不足！");
                return;
            }
            this.player.gold -= 10;
            this.player.hp = this.player.maxHp;
            this.updateMessage("你在旅館休息了一晚，HP 完全恢復了！");
        },

        // 開啟商店
        openShop() {
            if (this.showBattle) return;
            this.updateMessage("商店正在整修中，請稍後再來！");
        },

        // 顯示狀態
        showStatus() {
            if (this.showBattle) return;
            this.updateMessage(`
                等級: ${this.player.level}
                HP: ${this.player.hp}/${this.player.maxHp}
                攻擊力: ${this.player.attack}
                防禦力: ${this.player.defense}
                經驗值: ${this.player.exp}/${this.player.nextLevelExp}
                金幣: ${this.player.gold}
            `);
        }
    }
}
