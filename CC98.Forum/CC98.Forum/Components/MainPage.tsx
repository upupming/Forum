﻿import * as React from 'react';
import { AppState } from '../States/AppState';
import * as $ from 'jquery';
import * as Utility from '../Utility';
import { UbbContainer } from './UbbContainer';
import { Link } from 'react-router-dom';

/**
 * 全站公告组件
 * 为同时兼容新旧版98 临时调整了显示的内容
 **/
export class AnnouncementComponent extends React.Component<{ data }, {}> {
    render() {
        return <div className="announcement">
            <div className="mainPageTitle1">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">全站公告</div>
                </div>
            </div>
            <div className="announcementContent"><UbbContainer code={this.props.data} /></div>
        </div>
    }
}

/**
 * 推荐阅读组件
 **/
export class RecommendedReadingComponent extends React.Component<{ data }, { index: number }> {

    constructor(props) {
        super(props);
        //let data = Utility.getStorage('mainRecommendReading');
        //if (!data) { data = new Array<MainPageColumn>(); }
        this.state = {
            index: Math.floor(Math.random() * 5)    //0-4的随机数
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.convertButton = this.convertButton.bind(this);
    }
    /*
    async getRecommendedReading() {
        let recommendedReading: MainPageColumn[] = Utility.getStorage('mainRecommendReading');
        if (recommendedReading) { return recommendedReading; }
        else {
            recommendedReading = new Array<MainPageColumn>();
            const response = await Utility.cc98Fetch('/index/column/recommandationreading');
            const data = await response.json();
            for (let i = 0; i < 5; i++) {
                recommendedReading[i] = new MainPageColumn(data[i].imageUrl, data[i].title, data[i].url, data[i].content);
            }
            Utility.setStorage('mainRecommendReading', recommendedReading);
            return recommendedReading;
        }
    }

    async componentWillMount() {
        const x = await this.getRecommendedReading();
        this.setState({
            recommendedReading: x
        });
    }
    */
    handleMouseEnter(index) {
        this.setState({
            index: index,
        })
    }

    //使用箭头函数传参 记得用到this的函数都要先bind
    convertButton(value: number, index: number, array: number[]) {
        let className: string = value ? "recommendedReadingButtonSelected" : "recommendedReadingButton";
        return <div className={className} onMouseEnter={() => { this.handleMouseEnter(index) }}></div>

    }

    //在componentWillMount前似乎会render一次 这时this.state还是初值  所以需要先判断一次
    render() {
        let recommendedReading = this.props.data;

        let index = this.state.index;
        let styles = new Array(0, 0, 0, 0, 0);
        styles[index] = 1;
        let buttons = styles.map(this.convertButton);
        let imageUrl = "";
        let url = "";
        let title = "";
        let content = "";
        if (recommendedReading) {
            imageUrl = recommendedReading.length ? recommendedReading[index].imageUrl : "";

            title = recommendedReading.length ? recommendedReading[index].title : "";
            url = recommendedReading.length ? recommendedReading[index].url : "";
            content = recommendedReading.length ? recommendedReading[index].content : "";
        }

        return <div className="recommendedReading">
            <div className="mainPageTitle2">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">推荐阅读</div>
                </div>
            </div>
            <div className="recommendedReadingContent">
                <div className="recommendedReadingImage">
                    <img src={imageUrl} />
                </div>
                <div className="column" style={{ flexGrow: 1 }}>
                    <div className="recommendedReadingTitle"><a href={url} target="_blank">{title}</a></div>
                    <div className="recommendedReadingAbstract">{content}</div>
                    <div className="recommendedReadingButtons">{buttons}</div>
                </div>
            </div>
        </div>

    }
}

/**
 * 首页热门话题类
 * 用于首页的热门话题(十大），该类的对象（一条热门话题)需要标题，id，所在版面，及所在版面id等几个属性
 **/
export class HotTopicState {

    //属性
    title: string;
    id: number;
    boardName: string;
    boardid: number;

    //构造方法
    constructor(title, id, boardName, boardid) {
        this.title = title;
        this.id = id;
        this.boardName = boardName;
        this.boardid = boardid;
    }
}

/**
 * 热门话题组件
 **/
export class HotTopicComponent extends React.Component<{ data }, { mainPageTopicState: HotTopicState[] }> {




    convertMainPageTopic(item: HotTopicState) {
    const boardUrl = `/list/${item.boardid}`;
    const topicUrl = `/topic/${item.id}`;
    return <div className="mainPageListRow">
        <div className="mainPageListBoardName"> <a href={boardUrl} target="_blank">[{item.boardName}]</a></div>
        <div className="mainPageListTitle"><a href={topicUrl} target="_blank">{item.title}</a></div>
    </div >;
}

    render() {
        return <div className="mainPageList">
            <div className="mainPageTitle1">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">热门话题</div>
                </div>
            </div>
            <div className="mainPageListContent1">
                {this.props.data.map(this.convertMainPageTopic)}
            </div>
        </div>
    }
}

/**
 * 首页话题类
 * 用于首页左侧下方的几栏，该类的对象（一条主题)需要标题和id
 **/
export class MainPageTopicState {

    //属性
    title: string;
    id: number;

    //构造方法
    constructor(title, id) {
        this.title = title;
        this.id = id;
    }
}

/**
 * 首页话题更多参数
 * 拥有名称和链接两个属性
 */
export class MainPageTopicMoreProps {
    name: string;
    url: string;

    constructor(name, url) {
        this.name = name;
        this.url = url;
    }

}

/**
 * 首页话题组件
 * 需要列表名，fetchUrl和样式三个参数
 **/
export class MainPageTopicComponent extends React.Component<{ data, name: string, fetchUrl: string, style: string, mores: MainPageTopicMoreProps[] },
    { mainPageTopic: MainPageTopicState[] }> {

    convertMainPageTopic(item: MainPageTopicState) {
    const topicUrl = `/topic/${item.id}`;
    return <div className="mainPageListRow">
        <div className="mainPageListTitle"><a href={topicUrl} target="_blank">{item.title}</a></div>
    </div>
}

    render() {

        let moresHTML = this.props.mores.map((item) => {
            return <div className="mainPageTitleText"><a href={item.url} target="_blank">{item.name}</a></div>
        })

        const style: string = this.props.style;
        if (style === "black") {
            return <div className="mainPageList">
                <div className="mainPageTitle2">
                    <div className="mainPageTitleRow">
                        <i className="fa fa-volume-up"></i>
                        <div className="mainPageTitleText">{this.props.name}</div>
                    </div>
                    <div className="mainPageTitleRow">{moresHTML}</div>
                </div>
                <div className="mainPageListContent2">
                    {this.props.data.map(this.convertMainPageTopic)}
                </div>
            </div>
        } else if (style === "blue") {
            return <div className="mainPageList">
                <div className="mainPageTitle1">
                    <div className="mainPageTitleRow">
                        <i className="fa fa-volume-up"></i>
                        <div className="mainPageTitleText">{this.props.name}</div>
                    </div>
                    <div className="mainPageTitleRow">{moresHTML}</div>
                </div>
                <div className="mainPageListContent1">
                    {this.props.data.map(this.convertMainPageTopic)}
                </div>
            </div>
        }
    }
}

/**
 * 测试用组件~
 **/
export class Test extends React.Component<{}, { testContent: string }>{
    constructor(props) {
    super(props);
    this.state = {
        testContent: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.urlTextHanderler = this.urlTextHanderler.bind(this);
}

    handleChange(e) {
        this.setState({
            testContent: e.target.value
        });
    }

    async urlTextHanderler() {
        const reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/gim;
        const reg2 = /cc98\.org/i;
        const reg3 = /zju\.edu\.cn/i;
        const reg4 = /nexushd\.org/i;
        const url = this.state.testContent;
        const matchResult = url.match(reg);
        if (matchResult) {
            const domainName = matchResult[0];
            let isInternalLink = reg2.test(domainName) || reg3.test(domainName) || reg4.test(domainName);

            //return isInternalLink;
        } else {
            console.log("这不是链接！");
        }
    }

    async postAd() {
        const url = `/index/column/24`;
        const content = {
            type: 4,
            title: "一个图片不一样的广告",
            url: "www.cc98.org",
            imageUrl: "/images/推荐功能.jpg",
            enable: true,
            days: 10,
        }
        const postForumIndexColumnInfo = JSON.stringify(content);
        const token = Utility.getLocalStorage("accessToken");
        let myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", 'application/json');
        let response = await Utility.cc98Fetch(url, {
            method: 'PUT',
            headers: myHeaders,
            body: postForumIndexColumnInfo,
        });
        //console.log("发送成功！")
    }
    async signIn() {
        const url = `/me/signin`;

        const token = Utility.getLocalStorage("accessToken");
        let myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", 'application/json');
        myHeaders.append("Content-Type", "application/json");

        let content = "日常";
        const response = await Utility.cc98Fetch(url, { method: "POST", headers: myHeaders, body: content });
    }

    render() {
        return <div className="mainPageList">
            <div className="mainPageTitle2">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">测试区</div>
                </div>
            </div>
            <div className="mainPageListContent2">
                <div>这里是可爱的adddna测试的地方~</div>
                <input name="testContent" type="text" id="loginName" onChange={this.handleChange} value={this.state.testContent} />
                <div>封印封印</div>
            </div>
        </div>
    }
}

/**
 * 首页栏目类
 * 用于首页的栏目，包括推荐阅读、推荐功能以及校园新闻。
 * 该类的成员对象包括：图片url（校园新闻不需要），标题，url，以及摘要（仅推荐阅读需要）
 * 这部分栏目均设置在新窗口打开链接
 **/
export class MainPageColumn {

    //属性
    imageUrl: string;
    title: string;
    url: string;
    content: string;

    //构造方法
    constructor(imageUrl, title, url, content) {
        this.imageUrl = imageUrl;
        this.title = title;
        this.url = url;
        this.content = content;
    }
}

/**
 * 推荐功能组件
 */
export class RecommendedFunctionComponent extends React.Component<{ data }, {}>{

    convertRecommendedFunction(item: MainPageColumn) {
    return <div className="recommendedFunctionRow">
        <div className="recommendedFunctionImage"><img src={item.imageUrl}></img></div>
        <div className="recommendedFunctionTitle"><a href={item.url} target="_blank">{item.title}</a></div>
    </div>
}
    render() {
        return <div className="recommendedFunction">
            <div className="mainPageTitle1">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">推荐功能</div>
                </div>
            </div>
            <div className="recommendedFunctionContent">
                {this.props.data.map(this.convertRecommendedFunction)}
            </div>
        </div>
    }
}

/**
 * 校园新闻组件
 */
export class SchoolNewsComponent extends React.Component<{ data }, {}>{

    convertSchoolNews(item: MainPageColumn) {
    return <div className="schoolNewsRow">
        <div className="schoolNewsTitle"><a href={item.url} target="_blank">{item.title}</a></div>
    </div>
}

    render() {

        return <div className="schoolNews">
            <div className="mainPageTitle2">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">校园新闻</div>
                </div>
            </div>
            <div className="schoolNewsContent">
                {this.props.data.map(this.convertSchoolNews)}
            </div>
        </div>
    }
}

/**
 * 首页广告组件
 * 每30s切换一条
 */
export class AdsComponent extends React.Component<{}, { ads: MainPageColumn[], index: number }>{

    private timer: any;

    constructor(props) {
        super(props);
        let data = Utility.getStorage('mainAds');
        if (!data) { data = new Array<MainPageColumn>(); }
        this.state = {
            ads: data,
            index: 0,
        };
        this.changeIndex = this.changeIndex.bind(this);
    }

    async getAds() {
        let ads: MainPageColumn[] = Utility.getStorage('mainAds');
        if (ads) { return ads }
        else {
            ads = new Array<MainPageColumn>();
            const response = await Utility.cc98Fetch('/config/global/advertisement');
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                ads[i] = new MainPageColumn(data[i].imageUrl, data[i].title, data[i].url, data[i].content);
            }
            Utility.setStorage('mainAds', ads);
            return ads;
        }
    }

    async componentWillMount() {
        const x = await this.getAds();
        const length = x.length;
        this.setState({
            ads: x,
            index: Math.floor(Math.random() * length)
        });
    }

    //设定定时器 每30s调用一次changeIndex()
    componentDidMount() {
        this.timer = setInterval(() => { this.changeIndex(this.state.index) }, 30000);
    }

    //当组件从页面上移除时移除定时器
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    //根据当前广告角标返回下一角标
    changeIndex(index) {
        let total = this.state.ads.length;
        let nextIndex = index + 1;
        if (nextIndex >= total) nextIndex = 0;
        this.setState({
            index: nextIndex,
        })
    }

    render() {
        let ads = this.state.ads;
        let index = this.state.index;

        let url = ads.length ? ads[index].url : "";
        let imageUrl = ads.length ? ads[index].imageUrl : "";

        return <div>
            <a href={url} target="_blank"><img src={imageUrl} style={{ width: "18.75rem", height: "6.25rem" }} /></a>
        </div>;
    }
}

/**
 * 论坛统计组件
 **/
export class MainPageCountComponent extends React.Component<{ data }, { data }> {

    constructor(props) {    //为组件定义构造方法，其中设置 this.state = 初始状态
    super(props);       //super 表示调用基类（Component系统类型）构造方法
    //let data = Utility.getLocalStorage("mainDataCount");
    //if (!data) { data = []; }
    this.state = {
        data: this.props.data
    };
}
    /*
    async getData() {
        const response = await Utility.cc98Fetch('/config/global');
        let data = await response.json();
        Utility.setLocalStorage("mainDataCount", data);
        return data;

    }
    async componentDidMount() {
        const x = await this.getData();
        this.setState({
            data: x,
        });
    }
    */
    render() {
        const data = this.state.data;
        return <div className="mainPageCount">
            <div className="mainPageTitle2">
                <div className="mainPageTitleRow">
                    <i className="fa fa-volume-up"></i>
                    <div className="mainPageTitleText">论坛统计</div>
                </div>
            </div>
            <div className="mainPageCountContent" style={{ height: "10rem" }}>
                <div className="mainPageCountRow">
                    <div className="mainPageCountTitle">今日帖数</div>
                    <div className="mainPageCountTitle">{data.todayCount}</div>
                </div>
                <div className="mainPageCountRow">
                    <div className="mainPageCountTitle">论坛总主题数</div>
                    <div className="mainPageCountTitle">{data.topicCount}</div>
                </div>
                <div className="mainPageCountRow">
                    <div className="mainPageCountTitle">论坛总回复数</div>
                    <div className="mainPageCountTitle">{data.postCount}</div>
                </div>
                <div className="mainPageCountRow">
                    <div className="mainPageCountTitle">总用户数</div>
                    <div className="mainPageCountTitle">{data.userCount}</div>
                </div>
                <div className="mainPageCountRow">
                    <div className="mainPageCountTitle">欢迎新用户</div>
                    <div className="mainPageCountTitle"><Link to={`/user/name/${data.lastUserName}`}>{data.lastUserName}</Link></div>
                </div>
            </div>
        </div>

    }
}

/**
 * 推荐版面组件
 */
export class RecommendedBoardComponent extends React.Component<{}, {}>{
    render() {
    return <div></div>
}
}

/**
 *首页统计类
 *包括今日帖数，总主题数，总回复数，总用户数，最新用户
 */
export class MainPageCountProps {

    //属性
    todayCount: number;
    topicCount: number;
    postCount: number;
    userCount: number;
    lastUserName: string;

    //构造方法
    constructor(todayCount, topicCount, postCount, userCount, lastUserName) {
        this.todayCount = todayCount;
        this.topicCount = topicCount;
        this.postCount = postCount;
        this.userCount = userCount;
        this.lastUserName = lastUserName;
    }

}

/**
 * 主页
 */
export class MainPage extends React.Component<{}, { data }> {

    constructor(props) {    //为组件定义构造方法，其中设置 this.state = 初始状态
        super(props);       //super 表示调用基类（Component系统类型）构造方法  
            let data = {
                academics: [],
                announcement: "",
                emotion: [],
                fleaMarket: [],
                fullTimeJob: [],
                hotTopic: [],
                lastUserName: "",
                partTimeJob: [],
                postCount: 0,
                recommandationFunction: [],
                recommandationReading: [],
                schoolEvent: [],
                schoolNews: [],
                study: [],
                todayCount: 0,
                topicCount: 0,
                userCount: 0
            };
        this.state = {
            data: data
        };
    }

    async getData() {
        let data = Utility.getLocalStorage("mainPageData");
        if (!data) {
            const response = await Utility.cc98Fetch('/config/index');
            data = await response.json();
            Utility.setLocalStorage("mainPageData", data, 300);
            return data;
        } else {
            return data
        }
    }

    async componentDidMount() {
        const x = await this.getData();
        this.setState({
            data: x,
        });
    }

    render() {

        let data = this.state.data;

        let study: MainPageTopicMoreProps[] = new Array({ name: "学习", url: "/list/68" }, { name: "外语", url: "/list/304" }, { name: "考研", url: "/list/263" }, { name: "出国", url: "/list/102" });
        let emotion: MainPageTopicMoreProps[] = new Array({ name: "缘分", url: "/list/152" }, { name: "小屋", url: "/list/114" }, { name: "感性", url: "/list/81" });
        let fleaMarket: MainPageTopicMoreProps[] = new Array({ name: "数码", url: "/list/562" }, { name: "生活", url: "/list/80" }, { name: "服饰", url: "/list/563" });
        let fullTimeJob: MainPageTopicMoreProps[] = new Array({ name: "更多", url: "/list/235" });
        let partTimeJob: MainPageTopicMoreProps[] = new Array({ name: "更多", url: "/list/459" });

        let count: MainPageCountProps = new MainPageCountProps(data.todayCount, data.topicCount, data.postCount, data.userCount, data.lastUserName);

        //console.log(study);

        return <div className="mainPage">
            <div className="leftPart">
                <AnnouncementComponent data={data.announcement} />
                <RecommendedReadingComponent data={data.recommandationReading} />
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <HotTopicComponent data={data.hotTopic} />
                    <MainPageTopicComponent data={data.schoolEvent} name="校园活动" fetchUrl="/topic/school-event" style="blue" mores={[]} />
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>

                    <MainPageTopicComponent data={data.academics} name="学术信息" fetchUrl="/topic/academics" style="black" mores={[]} />
                    <MainPageTopicComponent data={data.study} name="学习园地" fetchUrl="/topic/study" style="black" mores={study} />
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <MainPageTopicComponent data={data.emotion} name="感性·情感" fetchUrl="/topic/emotion" style="blue" mores={emotion} />
                    <MainPageTopicComponent data={data.fleaMarket} name="跳蚤市场" fetchUrl="/topic/flea-market" style="blue" mores={fleaMarket} />

                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <MainPageTopicComponent data={data.fullTimeJob} name="求职广场" fetchUrl="/topic/full-time-job" style="black" mores={fullTimeJob} />
                    <MainPageTopicComponent data={data.partTimeJob} name="实习兼职" fetchUrl="/topic/part-time-job" style="black" mores={partTimeJob} />
                </div>
            </div>
            <div className="rightPart">
                <RecommendedFunctionComponent data={data.recommandationFunction} />
                <SchoolNewsComponent data={data.schoolNews} />
                <AdsComponent />
                <MainPageCountComponent data={count} />
            </div>
        </div>;
    }

}

