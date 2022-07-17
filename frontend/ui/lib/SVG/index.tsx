import * as React from "react"
import cx from "classnames"

import * as svgStyle from "./style.module.scss"

interface SVGSize {
  width: number
  height: number
}

export interface Props {
  html: any
  size?: SVGSize
  color?: string
  style?: any
  className?: string
  cleanup?: string[]
  show?: boolean
}

const cleanups = {
  // some useless stuff for us
  // that svgo doesn"t remove
  title: /<title>.*<\/title>/gi,
  desc: /<desc>.*<\/desc>/gi,
  comment: /<!--.*-->/gi,
  defs: /<defs>.*<\/defs>/gi,

  // remove hardcoded dimensions
  width: / +width="\d+(\.\d+)?(px)?"/gi,
  height: / +height="\d+(\.\d+)?(px)?"/gi,

  // remove fill
  fill: / +fill=\"(none|#[0-9a-f]+)\"/gi,

  // Sketch.app shit
  sketchMSShapeGroup: / +sketch:type=\"MSShapeGroup\"/gi,
  sketchMSPage: / +sketch:type=\"MSPage\"/gi,
  sketchMSLayerGroup: / +sketch:type=\"MSLayerGroup\"/gi,
}

export default class SVG extends React.Component<Props> {
    render(): JSX.Element {
    const {
      html,
      size,
      color,
      style,
      className,
      //...rest
    } = this.props;

    let styleProps: { 
      width?: number, 
      height?: number, 
      color?: string, 
      fill?: string, 
      verticalAlign?: string 
    }
    if (!style) {
      styleProps = {}
      if (size) {
        styleProps.width = size.width
        styleProps.height = size.height
        styleProps.verticalAlign = "bottom"
      }
      if (color) {
        styleProps.color = color
        styleProps.fill = color
      }
    } else {
      styleProps = style
    }

    let classes

    if (className) {
      classes = cx({
        [className]: true,
      })
    }

    if (typeof html !== "string") {
      const HtmlAlias = html
      // this assumes that the type is already some kind of SVG react component
      return (
        <HtmlAlias className={svgStyle.svg} style={styleProps} />
      )
    }
    return (
      <span className={svgStyle.svg} dangerouslySetInnerHTML={{
        __html: this.cleanupSvg(html).replace(
          /<svg/,
          "<svg" +
          (
            className
              ? ` class="${classes}"` : ""
          ) +
          (
            color
              ? ` fill="${color}"`
              : ""
          ) +
          (
            styleProps.width || styleProps.height
              ? " style=\"" +
              (styleProps.width ? `width: ${styleProps.width}px;` : "") +
              (styleProps.height ? `height: ${styleProps.height}px;` : "") +
              "vertical-align: bottom;\""
              : ""
          )
        ),
      }} style={styleProps} />
    )
  }

  cleanupSvg = (svg: string) => {
    return Object.keys(cleanups)
      .reduce((acc, key) => {
        return acc.replace(cleanups[key], "")
      }, svg)
      .trim()
  }
}

/**
  The MIT License (MIT)

  Copyright (c) 2015 Maxime Thirouin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
