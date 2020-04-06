// 魔方类
import { arrayUnique } from '@/common/utils';

// const plane_contact_plane = (check: { x: number; y: number, x1: number, y1: number }, plane: Object, full: Boolean = false): boolean => {
//   var {
//     x: left, y1: bottom, x1: right, y: top,
//   } = check;
//   const domA = {
//     left, bottom, right, top,
//   };
//
//   // @ts-ignore
//   var {x: left, y1: bottom, x1: right, y: top} = plane;
//   const domB = {
//     left, bottom, right, top,
//   };
//
//   if (domA.left >= domB.right || domA.top >= domB.bottom || domA.right <= domB.left || domA.bottom <= domB.top) {
//     return false; // 未碰撞
//   }
//   return true; // 碰撞
// };

/**
 * 输入数组和指定矩形，返回这个元素左和上有几个缝隙。
 * @param areaList 整个界面的数组
 * @param area 对应的矩形
 */
// export const getRowColSpan = (areaList:any[], area:object) => {
//   const y1arr = areaList.map(areaItem => areaItem.y1);
//
//   // 得到所有不同y的值
//   const yarr = arrayUnique(y1arr);
//
//   const x1arr = areaList.map(areaItem => areaItem.x1);
//
//   // 得到所有不同y的值
//   const xarr = arrayUnique(x1arr);
//
//   // 加入横竖各有有四个方块，则各需要3个缝隙（只计算区块之间的缝隙即可)。
//
//   return { rownum: yarr.length - 1 >= 0 ? yarr.length - 1 : 0, colnum: xarr.length - 1 >= 0 ? xarr.length - 1 : 0 };
// };


/**
 * 面有某个点在另一个面里面,需要看四个点
 * @param check
 * @param plane
 * @param full 是否要求所有点都在面里面（检测新建区域在画布内用full=1,其他的只要有一个点在就行了)
 */
const plane_in_plane = (check: any, plane: any, full: Boolean = false): boolean => {

  // @ts-ignore
  let {x: left, y1: bottom, x1: right, y: top} = check;
  const domA = {
    left, bottom, right, top,
  };

  // @ts-ignore
  let {x: left1, y1: bottom1, x1: right1, y: top1} = plane;
  const domB = {
    left1, bottom1, right1, top1,
  };


  // 允许边缘在一起
  if (full) {
    return !(domA.left >= domB.right || domA.top >= domB.bottom || domA.right <= domB.left || domA.bottom <= domB.top);
    // 碰撞
  }


  // 不允许边缘在一起
  return !(domA.left > domB.right || domA.top > domB.bottom || domA.right < domB.left || domA.bottom < domB.top);
  // 碰撞
};

/**
 * 计算矩形面积
 * @param area
 */
const countArea = (area: {x:number, y:number, x1:number, y1:number}) => {
  // @ts-ignore
  const {
    x, y, x1, y1,
  } = area;
  return (y1 - y) * (x1 - x);
};


class MagicCube {
  row: Number;

  col:Number;

  width: Number;

  height:Number;

  // tmpl:object = {
  //   x: 0, y: 0, x2: 0, y2: 0,
  // };// 模板，用四个角标来记录每个选中的区域

  selects:any[] = [];

  base: Object;

  // 记录已经选择的热区
  // , selecteds = []
  constructor(row: number = 5, col: number = 5, w: number = 750, h: number = 750) {
    this.row = row;
    this.col = col;
    this.height = h;
    this.width = w;
    // this.selects = selecteds;//初始化选择的数据
    this.base = {
      x: 0, y: 0, x1: col, y1: row,
    };
  }

  // set_row(row: number) {
  //   this.row = row;
  // }
  //
  // get_selects() {
  //   return this.selects;
  // }


  /**
   * 检查已用面积是不是小于总面积，这样可以检测是否铺满
   */
  is_full() {
    // @ts-ignore
    let areaCount = 0;
    // @ts-ignore
    const fullAreaCount = this.row * this.col;

    for (const area of this.selects) {
      areaCount += countArea(area);
    }
    console.log(areaCount, fullAreaCount);

    return areaCount === fullAreaCount;
  }

  /**
   * 加入区域到选择列表中
   * @param area
   */
  add_selects(area: object) {
    try {
      this.selects.push(area);
      console.info('创建画布成功');
    } catch (e) {
      throw '添加画布失败';
    }
  }

  /**
   * 删除某个选中的
   * @param area
   */
  del_selects(area: object) {
    let idx:number = 0;
    for (let i = 0; i < this.selects.length; i++) {
      if (JSON.stringify(this.selects[i]) === JSON.stringify(area)) {
        idx = i;
        break;
      }
    }

    if (idx === null) return false;

    this.selects.splice(idx, 1);

    return true;
  }


  create_area(x: number, y: number, x1: number, y1: number) {
    // 有冲突就返回
    if (this.is_conflict({
      x, y, x1, y1,
    })) {
      console.warn('创建画布失败');
      return false;
    }

    const IDX = this.selects.length;// 每个人选择下标作为index
    // 加入列表,错误会报错终止运行
    this.add_selects({
      x, y, x1, y1, IDX,
    });

    return true;
  }


  /**
   * 检测四个点是否符合创建热区的要求。1：不能超出边界 2.不能和已有的热区冲突.
   * point_in_plane 这个函数可以一直用，四个定点和所有边界进行比较， 和边界比较比较时，需要四个点都在里面  和已有区域比较，需要所有点都不在。
   * @param creat
   */
  is_conflict(creat:any): boolean {
    const is_in_wrap = plane_in_plane(creat, this.base, true);

    if (is_in_wrap) {
      for (const area of this.selects) {
        console.log(area);
        // 有一个冲突就不行
        if (plane_in_plane(creat, area, true)) {
          console.log('与现有画布冲突', creat, area);
          return true;
        }
      }
      return false;
    }
    console.log('超出画布范围');
    return true;
  }
}


export default MagicCube;
