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
    },
    // [][]
    // [][]
    {
        0: {
            row: 1,
            col: 1
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
    },
    // [][]
    //   [][]
    {
        0: {
            row: 1,
            col: 1
        },
        1: {
            row: 2,
            col: 3
        },
        2: {
            row: 2,
            col: 2
        },
        3: {
            row: 1,
            col: 2
        },
    },
    //   []
    // [][][]
    {
        0: {
            row: 1,
            col: 2
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
            row: 2,
            col: 3
        },
    }
];

// 变量 当前模型
let currentModel = {};

// 定位16宫格
let currentX = 0;
let currentY = 0;

// 保存所有被固定的块元素, 以及位置
let fixedBlocks = {};

// 入口函数
function init() {
    createModel();
    onkeyDown();
}

/**
 * 创建新模型
 */
function createModel() {
    // 当前使用模型
    currentModel = MODELS[Math.floor(Math.random()*4)];
    // currentModel = MODELS[3];
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

/**
 * 根据数据定位每个块元素的位置
 */
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
}

/**
 * 监听用户的键盘事件
 */
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
                break;
        }
    }
}

/**
 * 移动位置
 * @param x 坐标x
 * @param y 坐标y
 */
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
    // 判断操作是否会影响固定的方块
    if (isMeet(currentX + x, currentY + y, currentModel)) {
        if (y !== 0) {
            fixedBottomMode();
        }
        return;
    }
    // 定位
    currentX += x;
    currentY += y;

    // 重新定位块元素
    locationBlocks()
}

/**
 * 模型的旋转
 */
function rotate() {
    // 算法：
    // 旋转后的行 = 旋转前的列
    // 旋转后的列 = 3 - 旋转前的行

    // 克隆 currentCurrentModel
    let cloneCurrentCurrentModel = _.cloneDeep(currentModel);

    for (let key in cloneCurrentCurrentModel) {
        // 块元素的数据源
        let blockModel = cloneCurrentCurrentModel[key];
        // run
        let temp = blockModel.row;
        blockModel.row = blockModel.col;
        blockModel.col = 3 - temp;
    }

    // 将要移动的位置是否会发生触碰
    if (isMeet(currentX, currentY, cloneCurrentCurrentModel)) {
        return;
    }

    //
    currentModel = cloneCurrentCurrentModel;

    // 重新定位
    locationBlocks();
}

/**
 * 控制模型只能在容器中移动
 */
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

/**
 * 把模型固定到底部
 */
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
        // 行_列：元素
        let blockModel = currentModel[i];
        fixedBlocks[(currentY + blockModel.row) + "_" + (currentX + blockModel.col)] = activityModelEle;
    }
    // 判断一行是否被铺满
    isRemoveLine();

    // 3. 创建新模型
    createModel();
}

/**
 * 判断块元素之间的触碰
 * @param x 16宫格将要移动到的位置x
 * @param y 16宫格将要移动到的位置y
 * @param model 模型将要发生变化
 */
function isMeet(x, y, model) {
    // 如果一个活动中的模型触碰到了固定的块元素活动中的模型将不可以继续走
    // 判断碰撞，活动中的模型将要移动到的位置 返回 true / false
    for (let key in model) {
        let blockModel = model[key];
        // 判断是否存在元素
        if (fixedBlocks[(y + blockModel.row) + "_" + (x + blockModel.col)]) {
            return true;
        }
    }
    return false;
}

/**
 * 判断是否被铺满
 */
function isRemoveLine() {
    // 在一行中 每一列 都存在块元素，那么改行需要被清空
    // 遍历所有行中的所有列
    for (let i = 0; i < ROW_COUNT; i++) {
        // 标记, 假设当前行已经被铺满了
        let flag = true;
        // 该行中所有的列
        for (let j = 0; j < COL_COUNT; j++) {
            if (!fixedBlocks[i + "_" + j]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            // 该行已经被铺满了
            removeLine(i);
        }
    }
}

/**
 * 清理当前行方块
 * @param line 要清理的行
 */
function removeLine(line) {
    // 1.删除该行所有元素
    // 2.删除该行中所有 块元素 的数据
    for (let i = 0; i < COL_COUNT; i++) {
        // 删除块元素
        document.getElementById("container").removeChild(fixedBlocks[line + "_" + i]);
        // 清除该行数据
        fixedBlocks[line + "_" + i] = null;
    }
    downLine(line);
}

/**
 * 让被清理行上的方块掉落
 * @param line 要清理的行
 */
function downLine(line) {
    // 1.被清理行之上的所有块元素数据 源所在的行数+1
    // 2.让块元素在容器中下降
    // 3.清理掉之前的块元素

    // 遍历被清理之上的所有行
    for (let i = line - 1; i >= 0; i--) {
        for (let j = 0; j < COL_COUNT; j++) {
            // 如果当前行的当前列不存在数据
            if (!fixedBlocks[i + "_" + j]) continue;
            // 1.被清理行之上的所有块元素数据 源所在的行数+1
            fixedBlocks[(i + 1) + "_" + j] = fixedBlocks[i + "_" + j];
            // 2.让块元素在容器中下降
            fixedBlocks[(i + 1) + "_" + j].style.top = (i + 1) * STEP + "px";
            // 3.清理掉之前的块元素
            fixedBlocks[i + "_" + j] = null
        }
    }
}
