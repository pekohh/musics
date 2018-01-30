import Jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'
import axios from 'axios'

// 获取轮播图的推荐歌曲列表recommend
export function getRecommend () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return Jsonp(url, data, options)
}

// 获取recommand里面歌单列表的数据
export function getDiscList () {
  let url = '/api/getDiscList'
  let data = Object.assign({}, commonParams, {
    format: 'json',
    hostUin: 0,
    loginUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    g_tk: 5381,
    rnd: Math.random(),
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 求recommend的二级页面的数据
export function getSongList (disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return Jsonp(url, data, options)
}
