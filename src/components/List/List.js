import "./List.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { NavLink } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { push } from "react-router-redux"
import autobind from "autobind-decorator"
import classNames from "classnames"

import globalEmitter from "etc/globalEmitter"

@withRouter
@connect()
@autobind
export default class List extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    items: PropTypes.array,
    match: PropTypes.object,
    onKeyDown: PropTypes.func,
  }

  componentDidMount() {
    globalEmitter.on("select-next-item", () => this.selectItem(1))
    globalEmitter.on("select-previous-item", () => this.selectItem(-1))
  }

  render() {
    const { items, onKeyDown } = this.props
    return (
      <ul
        className={classNames("List", { empty: !items.length })}
        ref={list => this.list = list}
        onKeyDown={onKeyDown}
      >
        {
          items.map(item => {
            return (
              <li key={item.id} className={item.className}>
                <NavLink to={item.url} tabIndex={-1} onClick={item.onClick}>
                  { item.content }
                </NavLink>
              </li>
            )
          })
        }
      </ul>
    )
  }

  selectItem(offset) {

    const { dispatch, items, match: { url } } = this.props

    const index = items.findIndex(item => item.url === url)
    if (items[index + offset]) {
      dispatch(push(items[index + offset].url))
      setTimeout(() => {
        this.list.querySelector(".active").scrollIntoViewIfNeeded(false)
      }, 100)
    }

  }

}
