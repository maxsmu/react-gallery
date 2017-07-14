import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ImgFigure } from './components/img-figure/img-figure'
import { ControllerNav, ControllerUnit } from './components/controller-nav'

// import logo from './logo.svg'
import 'normalize.css'
import './iconFont/iconfont.css'
import './App.css'
// 获取图片相关数据
import imageDatas from './data/gallery-images.json'

export default class App extends Component {
  Contant = {
    centerPos: {
      left: 0,
      right: 0
    },
    // 水瓶方向的取值范围
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    // 垂直方向的取值范围
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  }
  state = {
    imgsArrangeArr: [
      // {
      //   pos: {
      //     left: 0,
      //     top: 0,
      //     rotate:0, // 旋转角度
      //     isInverse:false,  // 图片正反面
      //     isCenter:false // 图片是否居中
      //   }
      // }
    ]
  }
  /**
   * 获取区间内随机值
   * @param {number} low 下区间值
   * @param {number} hight 上区间值
   */
  getRangeRandom(low, hight) {
    return Math.ceil(Math.random() * (hight - low) + low)
  }
  /**
   * 获取 -30°到30° 之间任一值
   */
  get30Degrandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
  }
  /**
   * 重新布局所有图片
   * @param {number} centerIndex 指定居中排布那个图片
   */
  rearrange(centerIndex) {
    const imgsArrangeArr = this.state.imgsArrangeArr
    const { centerPos, hPosRange, vPosRange } = this.Contant

    const hPosRangeLeftSecX = hPosRange.leftSecX
    const hPosRangeRightSecX = hPosRange.rightSecX
    const hPosRangeY = hPosRange.y

    const vPosRangeX = vPosRange.x
    const vPosRangeTopY = vPosRange.topY

    // 头部区域显示的图片集合
    let imgsArrangeTopArr = []
    // 头部区域显示图片数量
    const topImgNum = Math.floor(Math.random() * 2)

    // 取一个或不取
    let topImgSpliceIndex = 0
    const imgsArrangeCenterArr = imgsArrangeArr.splice(topImgSpliceIndex, 1)

    // 首先居中 centerIndex 的图片
    // 居中的图片不需要旋转
    // 设置居中图片标记
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))

    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

    // 布局位于上侧的图片
    imgsArrangeTopArr = imgsArrangeTopArr.map(() => {
      return {
        rotate: this.get30Degrandom(),
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        isCenter: false
      }
    })

    // 布局左右两侧的图片
    let i = 0
    let j = imgsArrangeArr.length
    let k = j / 2
    for (i, j, k; i < j; i++) {
      let hPosRangeLORX;

      // 前半部分布局左侧，后半部分布局右侧
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }

      imgsArrangeArr[i] = {
        rotate: this.get30Degrandom(),
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        isCenter: false
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

    // 设置state 触发视图重新渲染
    this.setState({ imgsArrangeArr })
  }
  /**
    * 将图片名转成图片路径信息
    * @param {Array} imagesArr 图片名称列表
    * @return {Array} 含有真实路径的图片对象列表
    */
  genImagesUrl(imagesArr) {
    return imagesArr.map(img => {
      img.imageURL = require(`./images/${img.fileName}`);
      return img;
    }) || [];
  }
  /**
   * 翻转图片
   * @param {number} index 输入当前被执行inverse操作的图片信息数组的index值
   * @return {function} 闭包函数，一个真正待执行的函数
   */
  onInverse = index => {
    return () => {
      const { imgsArrangeArr } = this.state

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
      this.setState({ imgsArrangeArr })
    }
  }
  /**
   * 利用rearrange 函数，居中对应index的图片
   * @param {number} index 需要居中的图片对应的图片信息数组的index值
   * @return {function} 闭包函数，一个真正待执行的函数
   */
  onCenter = index => {
    return () => {
      this.rearrange(index)
    }
  }
  /**
   * 组件加载以后，为每一张图片计算其位置的范围
   */
  componentDidMount() {
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage)
    const stageW = stageDOM.scrollWidth
    const stageH = stageDOM.scrollHeight
    const halfStageW = Math.ceil(stageW / 2)
    const halfStageH = Math.ceil(stageH / 2)

    // 取到一个imgfigure 的大小
    const imgFigureDOM = ReactDOM.findDOMNode(ReactDOM.findDOMNode(this.refs.imgFigure0))
    const imgW = imgFigureDOM.scrollWidth
    const imgH = imgFigureDOM.scrollHeight
    const halfImgW = Math.ceil(imgW / 2)
    const halfImgH = Math.ceil(imgH / 2)

    // 计算中心图片的位置点
    this.Contant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算水平方向的位置点 (左侧区域、右侧区域)
    this.Contant.hPosRange = {
      leftSecX: [-halfImgW, (halfStageW - halfImgW * 3)],
      rightSecX: [(halfStageW + halfImgW), (stageW - halfImgW)],
      y: [-halfImgH, stageH - halfImgH]
    }

    // 计算垂直方向位置点 （上册区域））
    this.Contant.vPosRange = {
      x: [halfStageW - imgW, halfStageW],
      topY: [-halfImgH, (halfStageH - halfImgH * 3)]
    }

    this.rearrange(0)
  }
  render() {
    const { imgsArrangeArr } = this.state

    this.imageDatas = this.genImagesUrl(imageDatas)

    const imgFigures = []
    const controllerUnits = []

    // 遍历添加到图片数组
    this.imageDatas.forEach((img, index) => {
      if (!imgsArrangeArr[index]) {
        imgsArrangeArr[index] = {
          pos: { left: 0, top: 0 },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure center={this.onCenter(index)} inverse={this.onInverse(index)} arrange={imgsArrangeArr[index]} data={img} key={index} ref={'imgFigure' + index}></ImgFigure>)
      controllerUnits.push(<ControllerUnit center={this.onCenter(index)} inverse={this.onInverse(index)} arrange={imgsArrangeArr[index]} key={index} />)
    })

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <ControllerNav>
          {controllerUnits}
        </ControllerNav>
      </section>
    );
  }
}
