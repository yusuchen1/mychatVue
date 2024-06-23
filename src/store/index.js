import {createStore} from 'vuex'
import {selectChat,selectGroupChat} from '../api/chat.js'
import { reactive } from 'vue';

const store = createStore({
    state:{
        jwt:'nihao',
        leftMenuList:{
            groups:[
                {
                    id:'0',
                    avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/dzry.jpg',  //群头像
                    name:'青龙山疗养院',    //群名称
                    chats:[{
                        "id": '1800447253547073537',
                        "avatar": "https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg",
                      "nickname": "苏辰",
                      "sendUid": 2,
                      "receiveUid": 3,
                      "groupId": null,
                      "time": [
                        2024,
                        6,
                        11,
                        16,
                        37,
                        31
                      ],
                      "content": "爱还没来，天地间风云忽然变~",
                      "me": false
                    },] //群最新消息
                },
                {
                    id:'1',
                    avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/sxc258.jpg', 
                    name:'虾头蝻避难所', 
                    chats:[
                        {
                            "id": '1800447253547073537',
                                        "avatar": "https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg",
                                      "nickname": "苏辰",
                                      "sendUid": 2,
                                      "receiveUid": 3,
                                      "groupId": null,
                                      "time": [
                                        2024,
                                        6,
                                        11,
                                        16,
                                        37,
                                        31
                                      ],
                                      "content": "有情有义的人都要回来~",
                                      "me": false
                        }
                    ]
                }
            ],
            cronyGroups:[   //好友分组
                {
                    groupName:'好友',   //分组名
                    cronys:[
                        {
                            id:'0',
                            avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg',  //好友头像
                            name:'crush',    //好友昵称
                            chats:[
                                    {
                                        "id": '1800447253547073537',
                                        "avatar": "https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg",
                                      "nickname": "苏辰",
                                      "sendUid": 2,
                                      "receiveUid": 3,
                                      "groupId": null,
                                      "time": [
                                        2024,
                                        6,
                                        11,
                                        16,
                                        37,
                                        31
                                      ],
                                      "content": "爱还没来，天地间风云忽然变~",
                                      "me": false
                                    },
                                    {
                                      "id": '1800447450461278209',
                                      "avatar": "https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg",
                                      "nickname": "懒大王",
                                      "sendUid": 3,
                                      "receiveUid": 2,
                                      "groupId": null,
                                      "time": [
                                        2024,
                                        6,
                                        11,
                                        16,
                                        38,
                                        18
                                      ],
                                      "content": "有情有义的人都要回来~",
                                      "me": true
                                    },
                                    {
                                      "id": '1800450583933538306',
                                      "avatar": "https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg",
                                      "nickname": "苏辰",
                                      "sendUid": 2,
                                      "receiveUid": 3,
                                      "groupId": null,
                                      "time": [
                                        2024,
                                        6,
                                        11,
                                        16,
                                        50,
                                        45
                                      ],
                                      "content": "爱总会来，生死注定的来世再爱~",
                                      "me": false
                                    }
                                  ]
                        },
                        // {
                        //     id:'1',
                        //     avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg',
                        //     name:'丁真',
                        //     nmessage:'我槽你妈'
                        // }
                    ]
                }
                // ,{
                //     groupName:'哥们',
                //     cronys:[
                //         {
                //             id:'2',
                //             avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg',
                //             name:'龟儿',
                //             nmessage:'晚上八点街头那家店洗脚'
                //         },
                //         {
                //             id:'3',
                //             avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg',
                //             name:'龟孙',
                //             nmessage:'上号'
                //         }
                //     ]
                // }
            ],
        },
        nowChatId:'',
        defaultDialogVisible:false,
        smallDialogVisible:false,
        smallDialogTVisible:false,
        rid:'',
        gid:'',
        ws:'',
        defaultDrawerVisible:false,
        otherInfo:{
        },
        userMessage:{},
        avatar:'https://sc-canqiong.oss-cn-hangzhou.aliyuncs.com/defaultAvatar.jpg',
        defaultDialogIndex:0,
        // 2修改密码 3管理好友组 4群聊信息 5菜单群聊信息 6编辑群聊信息
        smallDialogIndex:0,
        // 1群聊管理
        smallDialogTIndex:0,
        defaultDrawerIndex:0,
        userInfo:{},
        groupInfo:{
            avatar:'',
            number:'',
            name:'',
            makeUsername:''
        },
        groupMembers:[]
    },
    mutations: {
        setJwt:(state,jwt) => {
            state.jwt = jwt;
        },
        setLeftMenuList:(state,list) => {
            state.leftMenuList = list;
        },
        reverseDefaultDialogVisible:(state) => {
            state.defaultDialogVisible = !state.defaultDialogVisible;
        },reverseSmallDialogVisible:(state) => {
            state.smallDialogVisible = !state.smallDialogVisible;
        },reverseSmallDialogTVisible:(state) => {
            state.smallDialogTVisible = !state.smallDialogTVisible;
        },
        reverseDefaultDrawerVisible:(state) => {
            state.defaultDrawerVisible = !state.defaultDrawerVisible;
        },
        setChats:(state,Lchats) => {
            if(Lchats.gid == null){
                const uid = Lchats.uid;
                for(let i = 0;i<state.leftMenuList.cronyGroups.length;i++){
                    let cronyGroup = state.leftMenuList.cronyGroups[i];
                    for(let j = 0;j<cronyGroup.cronys.length;j++){
                        let crony = cronyGroup.cronys[j];
                        if(uid == crony.id){
                            crony.chats = Lchats.chats;
                        }
                    }
                }
            }else{
                const gid = Lchats.gid;
                for(let i = 0;i<state.leftMenuList.groups.length;i++){
                    let group = state.leftMenuList.groups[i];
                    if(group.id == gid){
                        group.chats = Lchats.chats;
                    }
                }
            }
        },
        setRid:(state,rid) => {
            state.rid = rid;
        },
        setGid:(state,gid) => {
            state.gid = gid;
        },
        setNowChatId:(state,id) => {
            state.nowChatId = id;
        },
        setOtherInfo:(state,otherInfo) =>{
            state.otherInfo = otherInfo;
        },
        setAvatar :(state,avatar) => {
            state.avatar = avatar;
        },
        setUserInfo:(state,userInfo) =>{
            state.userInfo = userInfo;
        },
        updateOtherInfoCronyGroupId: (state,CronyGroupId) =>{
            state.otherInfo.cronyGroupId = CronyGroupId
        },
        updateOtherInfoCronyGroupVOS: (state,CronyGroupVOS) =>{
            state.otherInfo.cronyGroupVOS = CronyGroupVOS
        },updateOtherInfoGroupInput: (state,groupInput) =>{
            state.otherInfo.groupInput = groupInput
        },
        updateUserInfoAvatar: (state,avatar) =>{
            state.userInfo.avatar = avatar;
        },
        setUserMessage:(state,userMessage) =>{
            state.userMessage = userMessage;
        },
        setGroupInfo:(state,groupInfo) =>{
            state.groupInfo = groupInfo;
        },
        removeUserMessageByAskid:(state,askid) =>{
            console.log(state.userMessage)
            state.userMessage = state.userMessage.filter(function(item){
                console.log(item.askId)
                console.log(askid)
                return item.askId != askid;
            })
            console.log("删除后")
            console.log(state.userMessage)
        },
        updateCronyInfo:(state,info) =>{
            const cg = state.leftMenuList.cronyGroups
            let crony = reactive({});
            cg.forEach((item1) => {
                item1.cronys = item1.cronys.filter(item2 => {
                    if(item2.id == info.cronyId){
                        // 更新左菜单的昵称
                        item2.name = info.description;
                        // 更新聊天界面的昵称
                        item2.chats.forEach(item3 => {
                            if(!item3.me){
                                item3.nickname = info.description;
                            }
                        })
                        // 备份这个item然后删除移位
                        crony = item2;
                        return false;
                    }
                    return true;
                })
                console.log(item1);
            })
            //在更新后的数组中插入更新的好友
            cg.forEach(item => {
                if(item.groupName == info.cronyGroupName){
                    item.cronys.push(crony)
                }
            })
        },
        setDefaultDialogIndex:(state,index) => {
            state.defaultDialogIndex = index;
        },setDefaultDrawerIndex:(state,index) => {
            state.defaultDrawerIndex = index;
        },
        setSmallDialogIndex:(state,index) => {
            state.smallDialogIndex = index;
        },
        setSmallDialogTIndex:(state,index) => {
            state.smallDialogTIndex = index;
        },
        j2CronyChat:(state,id) => {
            const cronyGroups = state.leftMenuList.cronyGroups;
            for(let i = 0; i < cronyGroups.length;i++){
                for(let j = 0; j <cronyGroups[i].cronys.length ;j++){
                    if(cronyGroups[i].cronys[j].id == id){
                        state.nowChatId = "g-"+i+"-"+id;
                    }
                }
            }
        },
        j2GroupChat:(state,id) => {
            const groups = state.leftMenuList.groups;
            groups.forEach(group =>{
                if(group.id == id){
                    state.nowChatId = id;
                }
            })
        },
        updateLeftMenuDelCronyGroup:(state,cronyGroupName) => {
            let cronyGroups = state.leftMenuList.cronyGroups;
            state.leftMenuList.cronyGroups = cronyGroups.filter(item => {
                return cronyGroupName != item.groupName;
            })
        },updateLeftMenuDelCrony:(state,cronyId) => {
            let cronyGroups = state.leftMenuList.cronyGroups;
            for(let i = 0;i < cronyGroups.length; i++){
                state.leftMenuList.cronyGroups[i].cronys = cronyGroups[i].cronys.filter(item => {
                    console.log(item.id,cronyId)
                    return item.id != cronyId
                });
            }
        },updateLeftMenuDelGroup:(state, gid) => {
            state.leftMenuList.groups = state.leftMenuList.groups.filter(group => group.id != gid);
        }
    },
    actions: {
        getChat(store,rid){
            return new Promise((resolve, reject) => {
                selectChat(rid)
                .then(resp => {
                    store.commit('setChats',resp.data.data)
                    console.log(resp.data.data)
                    resolve(resp.data)
                }).catch(err => reject(err))
            })
        },getGroupChat(store,gid){
            return new Promise((resolve, reject) => {
                selectGroupChat(gid)
                .then(resp => {
                    store.commit('setChats',resp.data.data)
                    console.log(resp.data.data)
                    resolve(resp.data)
                }).catch(err => reject(err))
            })
        }
    },
    getters:{
        getChats:(state) => {
            const nowChatId = state.nowChatId;
            console.log("nowChatId:"+nowChatId)
            const ids = (nowChatId+"").split('-');
            // 说明是用户的id
            if(ids[0] == 'g'){
                console.log("ids.length:"+ids.length)
                const uid = ids[ids.length-1];
                console.log("uid:"+uid)
                for(let i = 0;i<state.leftMenuList.cronyGroups.length;i++){
                    let cronyGroup = state.leftMenuList.cronyGroups[i];
                    for(let j = 0;j<cronyGroup.cronys.length;j++){
                        let crony = cronyGroup.cronys[j];
                        if(uid == crony.id){
                            console.log(crony.chats)
                           return crony.chats;
                        }
                    }
                }
            }else{
                const gid = nowChatId;
                for(let i = 0;i<state.leftMenuList.groups.length;i++){
                    let group = state.leftMenuList.groups[i];
                    if(group.id == gid){
                        // console.log(crony.chats)
                        return group.chats;
                    }
                }
            }
        }
    }
})

export default store;