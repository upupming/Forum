﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from 'react';
import { MyMessageWindowProps } from '../Props/MyMessageWindowProps';
import { MyMessageWindowState } from '../States/MyMessageWindowState';
import { MyMessageProps } from '../Props/MyMessageProps';
import { MyMessageSender } from './MyMessageSender';
import { MyMessageReceiver } from './MyMessageReceiver';

import {
    BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom';

export class MyMessageWindow extends React.Component<MyMessageWindowProps, MyMessageWindowState>{

    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.getMessageData = this.getMessageData.bind(this);
    }

    async componentDidMount() {
        this.getMessageData(this.props);
    }

    async componentWillReceiveProps(nextProps) {
        this.getMessageData(nextProps);
    }

    async getMessageData(item: MyMessageWindowProps) {
        if (item.chatName != '系统') {
            let data = [];
            let startPage = -50;
            //循环取站短消息，一次性50条，直到全部取完
            do {
                startPage += 50;
                let response = await fetch(`https://api.cc98.org/Message?userName=${item.chatName}&filter=both`, {
                    headers: {
                        Range: `bytes=${startPage}-${startPage + 49}`,
                        Authorization: `Bearer ${item.token}`
                    }
                });
                let nowData = await response.json();
                for (let i in nowData) {
                    data.push(nowData[i])
                }
            } while (data.length % 50 == 0);
            //给每个数据都加上我和正在聊天者的头像的图片地址
            for (let i in data) {
                data[i].chatPortraitUrl = item.chatPortraitUrl;
                data[i].myPortraitUrl = item.myPortraitUrl;
            }
            //因为服务器上存储每条消息的时间只精确到分，所以同一分钟内的所有消息顺序正好是反的，所以需要重新排一下顺序，等樱桃把服务器上消息发送时间精确到秒之后就可以把这个步骤去掉了
            sortArr(data);
            
            this.setState({ data: data });
        }
    }

    coverMyMessageProps = (item: MyMessageProps) => {
        if (item.title == '回复提示' || item.title == '@提示' || item.title == '转账通知' || item.title == '系统消息' || item.title == `用户：${this.props.myName} 在帖子中回复了你`) {
        }
        else if (item.senderName == this.props.chatName) {
            return <MyMessageReceiver id={item.id} senderName={item.senderName} receiverName={item.receiverName} title={item.title} content={item.content} isRead={item.isRead} sendTime={item.sendTime} chatPortraitUrl={item.chatPortraitUrl} myPortraitUrl={item.myPortraitUrl} />
        }
        else {
            return <MyMessageSender id={item.id} senderName={item.senderName} receiverName={item.receiverName} title={item.title} content={item.content} isRead={item.isRead} sendTime={item.sendTime} chatPortraitUrl={item.chatPortraitUrl} myPortraitUrl={item.myPortraitUrl}/>
        }
    }

    postMessage = () => {
        let bodyObj = { receiverName: this.props.chatName, title: '你好', content: $('#myMessageContent').val() };
        let bodyContent = JSON.stringify(bodyObj);
        let messageId = fetch('https://api.cc98.org/Message', {
            method: 'POST',
            headers: { Authorization: `Bearer ${this.props.token}`, 'content-type': 'application/json'},
            body: bodyContent
        });
        //重新获取数据并渲染
        console.log($('#myMessageContent').val());
        //这里写法有点奇怪，但是这样写才能暂停0.2秒再执行this.getMessageData，不能在setTimeout的第一个函数里直接调用this.getMessageData,那样会立即执行
        let self = this;
        setTimeout(function () { self.getMessageData(self.props) }, 200);
        //清空输入框
        $('#myMessageContent').val('');
    }

    report = () => {
        alert('举报他人恶意私信请到【论坛事务】按照格式发帖投诉，记得截图保留证据，管理员会及时进行处理！感谢您对CC98的支持！');
    }

    render() {
        console.log('开始render');
        return (<div className='mymessage-message-window'>
                    <div className='mymessage-message-wHeader'>
                        <div className='mymessage-message-wReport'></div>
                        <div className='mymessage-message-wTitle'>与 {this.props.chatName} 的私信</div>
                        <div className='mymessage-message-wReport'><button onClick={this.report}>举报</button></div>
                    </div>
                    <div className='mymessage-message-wContent'>{this.state.data.map(this.coverMyMessageProps)}</div>
                    <div className='mymessage-message-wPost'>
                        <textarea className='mymessage-message-wPostArea' id='myMessageContent'></textarea>
                        <button className='mymessage-message-wPostBtn' onClick={this.postMessage}>回复</button>
                    </div>
                </div>);
    }
}


function sortArr(arr: MyMessageProps[]) {
    let s: number = -1;
    let e: number = -1;
    for (let i = 0; i < arr.length-1; i++) {
        if (arr[i].sendTime == arr[i + 1].sendTime && s == -1) {
            s = i;
        }
        else if (arr[i].sendTime != arr[i + 1].sendTime && s != -1) {
            e = i;
        }
        if (s != -1 && e != -1) {
            reverseArr(arr, s, e);
            s = -1;
            e = -1;
        }
    }
}

function reverseArr(arr: MyMessageProps[], s: number, e: number) {
    for (let i = s; i < e; i++) {
        [arr[i], arr[e]] = [arr[e], arr[i]];
        e--;
    }
}