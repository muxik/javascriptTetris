// const
// 每次移动的距离
const STEP = 20;
// 分割容器 18 * 10
const ROW_COUNT = 18, COL_COUNT = 10;
// 模型数据源
const MODELS = [
    /*
       0  1  2  3
    0 [ ][ ][ ][ ]
    1 [ ][ ][4][ ]
    2 [1][2][3][ ]
    3 [ ][ ][ ][ ]
    ROW → / COL ↓
     */
    {
        0: {
            row: 2,
            col: 0
        },
        1: {
            row: 2,
            col: 1
        },
        2: {
            row: 2,
            col: 2
        },
        3: {
            row: 1,
            col: 2
        },
    }
];

// 变量 当前模型
let currentModel = {};

// 定位16宫格
let currentX = 0;
let currentY = 0;

// 入口函数
function init() {
    createModel();
    onkeyDown();
}

// 创建新模型
function createModel() {
    // 当前使用模型
    currentModel = MODELS[0];
    // 初始化 16 宫格的位置
    currentY = 0;
    currentX = 0;
    // 根据模型的数据生成对于块元素
    for (let key in currentModel) {
        //块元素
        let divEle = document.createElement('div');
        divEle.className = "activity_model";
        document.getElementById('container').appendChild(divEle);
        // 定位
        locationBlocks();
    }
}

//根据数据定位每个块元素的位置
function locationBlocks() {
    // 检测16 宫格是否越界
    checkBound();
    // 块元素数据 模型里的row & col
    // 1. 拿到所有块元素
    let activityModelEles = document.getElementsByClassName('activity_model');
    for (let i = 0; i < activityModelEles.length; i++) {
        // 拿到每个块元素
        let activityModelEle = activityModelEles[i];
        // 拿到块元素数据源
        let blockModel = currentModel[i];
        // 2.根据每个块元素的数据源，通过top & left定位每个块元素的位置
        activityModelEle.style.top = (currentY + blockModel.row) * STEP + 'px';
        activityModelEle.style.left = (currentX + blockModel.col) * STEP + 'px';

    }
    console.log(currentX, currentY);
}

// 监听用户的键盘事件
function onkeyDown() {
    document.onkeydown = (event) => {
        // 上 38 下 40 左 37 右 39
        switch (event.keyCode) {
            case 38:
                rotate(); // 旋转
                // move(0, -1);
                break;
            case 40:
                move(0, 1);
                break;
            case 37:
                move(-1, 0);
                break;
            case 39:
                move(1, 0);
                break;
            default:
                console.log(event.keyCode);
                break;
        }
    }
}

// 移动
function move(x, y) {
    // 控制 left/top
    /*
    let activityModelEle = document.getElementsByClassName("activity_model");
    for (let i = 0; i < activityModelEle.length; i++) {
        console.log(activityModelEle[i]);
        activityModelEle[i].style.top = parseInt(activityModelEle[i].style.top || 0) + y * STEP + 'px';
        activityModelEle[i].style.left = parseInt(activityModelEle[i].style.left || 0) + x * STEP + 'px';
    }
    */
    // 定位
    currentX += x;
    currentY += y;

    // 重新定位块元素
    locationBlocks()
}

//模型的旋转
function rotate() {
    // 算法：
    // 旋转后的行 = 旋转前的列
    // 旋转后的列 = 3 - 旋转前的行
    for (let key in currentModel) {
        // 块元素的数据源
        let blockModel = currentModel[key];
        // run
        let temp = blockModel.row;
        blockModel.row = blockModel.col;
        blockModel.col = 3 - temp;
    }
    // 重新定位
    locationBlocks();
}

// 控制模型只能在容器中移动
function checkBound() {
    // 定义容器边界
    let leftBound = 0;
    let rightBound = COL_COUNT;
    let bottomBound = ROW_COUNT;
    // 当快元素超出了边界之后， 往后退
    for (let key in currentModel) {
        // 块元素
        let blockModel = currentModel[key];

        // 左侧越界
        if ((currentX + blockModel.col) < leftBound) {
            currentX++;
        }
        // 右侧越界
        if ((currentX + blockModel.col) >= rightBound) {
            currentX--;
        }
        // 底部越界
        if ((currentY + blockModel.row) >= bottomBound) {
            currentY--;
            fixedBottomMode();
        }

    }
}

// 把模型固定到底部
function fixedBottomMode() {
    // 1. 改变模型样式
    // 2. 让模型不可以继续移动

    // 拿到所有活动中的模型
    let activityModelEls = document.getElementsByClassName('activity_model');
    let len = activityModelEls.length;
    for (let i = len - 1; i >= 0; i--) {
        // 拿到块元素
        let activityModelEle = activityModelEls[i];
        // 修改类名
        activityModelEle.className = "fixed_model";
    }
    // 3. 创建新模型
    createModel();
}
