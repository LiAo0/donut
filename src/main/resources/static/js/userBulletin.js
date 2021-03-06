window.onload = function () {
    // 基准地址
    axios.defaults.baseURL = 'http://localhost:8080/donut/';
    // 相应拦截器
    axios.interceptors.response.use(function (res) {
        return res.data;
    }, function (error) {
        console.log(error)
    });
    let config = {
        //添加请求头
        headers: {"Content-Type": "multipart/form-data"},
        //添加上传进度监听事件
        onUploadProgress: e => {
            let completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
            this.progress = completeProgress;
        }
    };
    let table = new Vue({
            el: '#user_tables',
            data: {
                bulletin: '',        // 存储产品列表
                isActive: false,  // 控制导航栏样式
                updateUser: {
                    id: '',
                    account: '',
                    password: '',
                    roles: '',
                    name: '',
                    sex: '',
                    age: '',
                    email: '',
                    status: '',
                    img: ''
                },
                bulletinData: {
                    id: '',
                    bulletinTitle: '',
                    bulletinContent: '',
                    bulletinStatus: '',
                    bulletinUserImg:'',
                    bulletinUserName:''
                },
                pagination: {
                    pageNum: '1',     // 当前页数
                    goodsName: '',
                    selectTime:'0'
                },
            },
            methods: {
                // 用户数据回填事件
                userDataBackfill: function (user) {
                    this.updateUser.id = user.id;
                    this.updateUser.account = user.userAccount;
                    this.updateUser.password = user.userPassword;
                    this.updateUser.roles = user.userRoles;
                    this.updateUser.name = user.userName;
                    this.updateUser.sex = user.userSex;
                    this.updateUser.email = user.userEmail;
                    this.updateUser.status = user.userStatus;
                    this.updateUser.img = user.headImg;
                },
                // 公告数据回填事件
                goodsDataBackfill: function (bulletin) {
                    this.bulletinData.id = bulletin.id;
                    this.bulletinData.bulletinTitle = bulletin.bulletinTitle;
                    this.bulletinData.bulletinContent = bulletin.bulletinContent;
                    this.bulletinData.bulletinStatus = bulletin.bulletinStatus;
                    this.bulletinData.bulletinUserImg = bulletin.dUser.headImg;
                    this.bulletinData.bulletinUserName = bulletin.dUser.userName;
                },
                //获取当前用户登录Session事件
                obtainlLoginUserSerssion: async function () {
                    let rejson = await axios.post("user/obtainloginuser")
                    if (!rejson.bool) {
                        // 用户未登录
                        spop({
                            template: '用户身份过期，请重新登录',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                        setTimeout(function () {
                            window.location.href = '../login.html';
                        }, 2000)
                    } else {
                        // 回填数据方法
                        this.userDataBackfill(rejson.list[0])
                        console.log(rejson.list[0].headImg)
                    }
                },
                // 更改左侧导航栏样式
                changeNavigation: function () {
                    if (this.isActive) {
                        this.isActive = false;
                    } else {
                        this.isActive = true;
                    }
                },
                // 列表加载事件
                queryDate: async function () {
                    let params = new URLSearchParams();
                    params.append('bulletinStatus', "1");
                    params.append('bulletinTitle', this.pagination.goodsName);
                    params.append('pn', this.pagination.pageNum);
                    params.append('selectTime',this.pagination.selectTime)
                    let rejsons = await axios.post('bulletin/select', params);
                    console.log(rejsons);
                    this.bulletin = rejsons.data;
                },
                // 修改图标单击事件
                popup: function (bulletin) {
                    this.goodsDataBackfill(bulletin);
                    // 弹出框事件
                    $('#itemUser').popup({
                        time: 1000,
                        classAnimateShow: 'flipInX',
                        classAnimateHide: 'hinge',
                        // 界面开始
                        onPopupClose: function e() {
                        },
                        // 界面关闭事件
                        onPopupInit: function e() {
                        }
                    });
                },
                // 确认修改按钮
                updateUserEvent: async function (type) {
                    let params = new URLSearchParams();
                    // 执行用户修改
                    if (type) {
                        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                        params.append('id', this.updateUser.id);
                        params.append('userName', this.updateUser.name);
                        params.append('userRoles', this.updateUser.roles);
                        params.append('userSex', this.updateUser.sex);
                        params.append('userEmail', this.updateUser.email);
                        params.append('userStatus', this.updateUser.status);
                        params.append('headImg', this.updateUser.img);
                        // 执行修改
                        if (!reg.test(this.updateUser.email)) {
                            // 邮箱校验失败
                            spop({
                                template: '邮箱校验失败',
                                group: 'submit-satus',
                                style: 'error',
                                autoclose: 2000
                            });
                            return;
                        }
                        ;
                        if (this.updateUser.id == null) {
                            spop({
                                template: '用户ID为空',
                                group: 'submit-satus',
                                style: 'error',
                                autoclose: 2000
                            });
                            return;
                        }
                        // 执行修改
                        let updateUser = await axios.post('user/updateUser', params);
                        console.log(updateUser);
                        if (updateUser.bool) {
                            spop({
                                template: updateUser.message,
                                group: 'submit-satus',
                                style: 'success',
                                autoclose: 2000
                            });
                            this.queryDate();
                            if (type) {
                                spop({
                                    template: '即将跳转到登录',
                                    group: 'submit-satus',
                                    style: 'success',
                                    autoclose: 2000
                                });
                                setTimeout(function () {
                                    window.location.href = '../login.html';
                                }, 2000)
                            }
                        } else {
                            spop({
                                template: updateUser.message,
                                group: 'submit-satus',
                                style: 'error',
                                autoclose: 2000
                            });
                        }
                    } else {
                        // 执行公告修改
                        params.append('id', this.bulletinData.id);
                        // 执行产品图片添加
                        params.append('bulletinTitle', this.bulletinData.bulletinTitle);
                        params.append('bulletinContent', this.bulletinData.bulletinContent);
                        params.append('bulletinStatus', this.bulletinData.bulletinStatus);
                        let updBulletin = await axios.post('bulletin/update', params);
                        if (updBulletin.bool == true) {
                            spop({
                                template: '公告修改成功',
                                group: 'submit-satus',
                                style: 'success',
                                autoclose: 2000
                            });
                            // 调用请求后台数据方法
                            this.queryDate();
                        }
                    }
                },
                // 翻页
                pageTurning: function (type) {
                    if (type) {
                        // 下一页
                        if (this.pagination.pageNum < this.bulletin.pages) {
                            this.pagination.pageNum++;
                            this.queryDate();
                        } else {
                            spop({
                                template: '已经是最后一页',
                                group: 'submit-satus',
                                style: 'error',
                                autoclose: 2000
                            });
                        }
                    } else {
                        // 下一页
                        if (this.pagination.pageNum != 1) {
                            this.pagination.pageNum--;
                            this.queryDate();
                        } else if (this.pagination.pageNum == 1) {
                            spop({
                                template: '已经是第一页',
                                group: 'submit-satus',
                                style: 'error',
                                autoclose: 2000
                            });
                        }
                    }
                },
                /*// 商品图片按钮添加事件
                goodsImgAdd: function () {
                    $("#goodsImg").trigger("click");
                },
                // 产品图片选择事件
                async goodsSpecifiName(event) {
                    let formData = new FormData();
                    // let params = new URLSearchParams();
                    formData.append("file", event.target.files[0]);
                    if (event.target.files[0].name != null) {
                        // 执行图片上传
                        let goodsfileName = await axios.post("file/uploadFile", formData, config);
                        if (goodsfileName.fileName != null) {
                            // 云端数组赋值
                            cloudArr.push(goodsfileName.fileName);
                            this.updategGoods.img = cloudArr;
                        }
                    } else {
                        spop({
                            template: '图片为空',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                    }
                },
                // 产品图片删除事件
                imgDele: function (index) {
                    for (let i = 0; i < cloudArr.length; i++) {
                        if (cloudArr[i] == index) {
                            cloudArr.splice(i, 1);
                            this.updategGoods.img = cloudArr;
                            return;
                        }
                    }
                },*/
                // 修改当前登录用户信息
                loginUserDataUpdate: function () {
                    $('#itemLogin').popup({
                        time: 1000,
                        classAnimateShow: 'flipInX',
                        classAnimateHide: 'hinge',
                        onPopupClose: function e() {
                            // console.log('0')
                        },
                        onPopupInit: function e() {
                            // console.log('1')
                        }
                    });
                },
                // 头像上传单击事件
                choosAvatar: function () {
                    // document.getElementById("fileImg").click();
                    $("#fileImg").trigger("click");
                },
                // 头像选择事件
                async specifiName(event) {
                    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(event.target.files[0].name)) {
                        spop({
                            template: '图片格式错误',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                        return;
                    }
                    let formData = new FormData();
                    // let params = new URLSearchParams();
                    formData.append("file", event.target.files[0]);
                    if (event.target.files[0].name != null) {
                        // 执行图片上传
                        let userfileName = await axios.post("file/uploadFile", formData, config);
                        if (userfileName.fileName != null) {
                            // 头像上传成功
                            // this.userImg = '';
                            this.updateUser.img = userfileName.fileName;
                            /*this.userImg = "http://localhost:8080/donut/uploads/" + userfileName.fileName;
                            console.log(this.updateUser.img)*/
                        }
                    } else {
                        spop({
                            template: '图片为空',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                    }

                },
                // 添加公告单击
                productAdditionPopup: async function () {
                    this.bulletinData.bulletinTitle = this.bulletinData.bulletinContent = '';
                    // 页面弹出
                    $('#addGoods').popup({
                        time: 1000,
                        classAnimateShow: 'flipInX',
                        classAnimateHide: 'hinge',
                        // 界面开始
                        onPopupClose: function e() {
                        },
                        // 界面关闭事件
                        onPopupInit: function e() {
                        }
                    });
                },
                // 确认添加单击事件
                productAddition: async function () {
                    let params = new URLSearchParams();

                    params.append('bulletinUserid', this.updateUser.id);
                    params.append('bulletinTitle', this.bulletinData.bulletinTitle);
                    params.append('bulletinContent', this.bulletinData.bulletinContent);
                    // 验证数据
                    if (this.updateUser.id == null || this.updateUser.id == '') {
                        spop({
                            template: '用户为空',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                        return;
                    }
                    if (this.bulletinData.bulletinTitle == null || this.bulletinData.bulletinTitle == '') {
                        spop({
                            template: '标题为空',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                        return;
                    }
                    if (this.bulletinData.bulletinContent == null || this.bulletinData.bulletinContent == '') {
                        spop({
                            template: '标题为空',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                        return;
                    }
                    // 执行添加
                    let addBulletin = await axios.post('bulletin/add', params);
                    // 判断数据
                    if (addBulletin.bool == true) {
                        spop({
                            template: '公告发布成功',
                            group: 'submit-satus',
                            style: 'success',
                            autoclose: 2000
                        });
                        this.queryDate();
                    } else {
                        spop({
                            template: '公告发布失败',
                            group: 'submit-satus',
                            style: 'error',
                            autoclose: 2000
                        });
                    }
                },
                // 退出登录
                signOut:async function(){
                    let params = new URLSearchParams();
                    // 执行退出
                    let addPro = await axios.post('user/dropout');

                },
            },
            computed: {},
            filters: {
                // 过滤时间
                date(time) {
                    let date = new Date(time)//把定义的时间赋值进来进行下面的转换
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                }
                ,
                // 过滤图片
                img(img) {
                    return "http://localhost:8080/donut/uploads/" + img;
                }
            }
            ,
            mounted: function () {
                this.queryDate();
                // 获取Session
                this.obtainlLoginUserSerssion();
            }
        }
    )
}