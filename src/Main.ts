//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

// import GameEngine = game.GameEngine;

import BinarySearchTree = algorithm.BinarySearchTree;

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        manager.FrameManager.getInstance().m_MainStage = this.stage;
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        // await platform.login();
        // const userInfo = await platform.getUserInfo();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    private startView: game.StartScene;
    private gameView: game.GameView;


    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        //初始化开始界面
        this.startView = new game.StartScene();
        this.startView.addEventListener(customEvent.ViewEvent.EVENT_GAME_START, this.startGame, this);
        manager.FrameManager.getInstance().setCurrentScene(this.startView);
        // game.GameEngine.getIns().initGame();


        // let logic = new game.GameLogic();
        // let handle = new game.Grid(this);
        // let grid = this.getGrid();
        // // handle.addRandomTile();
        // grid[0][3] = 1;
        // grid[1][3] = 1;
        // console.log(grid);
        // console.log(logic.getBoard(2, grid));
    }

    private getGrid() {
        let cells = [];
        for(let n = 0; n < 5; n++) {
            let ary = [];
            for (let m = 0; m < 5; m++) {
                ary.push(null);
            }
            cells.push(ary);
        }
        return cells;
    }

    private startGame() {
        this.gameView = new game.GameView();
        game.GameEngine.getIns()._gameView = this.gameView;
        this.gameView.addEventListener(customEvent.ViewEvent.EVENT_RETURN_EVENT, this.return, this);
        //初始化
        manager.FrameManager.getInstance().replaceScene(this.gameView, true).then(() => {
            //游戏开始
            game.GameEngine.getIns().runGame();
        });
    }

    private return() {
        //host状态重置
        manager.FrameManager.getInstance().replaceScene(this.startView, true).then(() => {
            this.gameView.dealloc();
            this.gameView = null;
        });
    }

}
