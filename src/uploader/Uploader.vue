<template>
    <div class="upload" :style="styleObj">
      <template v-if="mode=='edit'||mode=='view'">
        <Row>
          <Col span="24">
            <div v-if="mode=='edit'" class="v-fileupload-operation margin-bottom-15">
              <file-upload
                :class="[customClass?customClass:'btn btn-primary btn-xs btn-flat']"
                name="upload"
                :ref="ref"
                post-action="ecpJson.action"
                :multiple="false"
                :directory="false"
                :thread="1"
                v-model="files"
                @input-file="inputHandler"
              >上传附件
              </file-upload>
            </div>
          </Col>
        </Row>
        <Row>
          <Table :columns="columns" :data="uploadedFiles"></Table>
        </Row>
      </template>
      <template v-else-if="mode=='single'">
        <file-upload
                class="btn btn-primary btn-xs btn-flat"
                name="upload"
                :ref="ref"
                post-action="ecpJson.action"
                :multiple="false"
                :directory="false"
                :thread="1"
                v-model="files"
                @input-file="inputHandler"
        >{{btnText||'上传附件'}}
        </file-upload>
      </template>
    </div>
</template>
<script>

  import FileUpload from "vue-upload-component"
  import {Table, Row, Col} from "iview"

  export default {
    props: ['category', 'bsnId', 'bsnType', 'bsnName', 'mode', 'editMode', 'btnText', 'done', 'error', 'atchTplItmId', 'customClass'],
    components: {
      FileUpload,
      Table,
      Row,
      Col
    },
    data: function () {
      var self = this;
      var ref = Math.random().toString(16).substr(2)
      var isIE9 = (navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0")) ? true : false;
      var reqData = {
        OPER_CODE: window.OPER_CODE,
        OPER_NAME: window.OPER_FULL_NAME
      }
      var initFormData = {
        _fw_service_id: "simpleTransaction",//
        transFlag: "p8_rp",//
        remotePath: (this.category || "default")+ "/" + (new Date().getFullYear()) + "_" + (new Date().getMonth() + 1) + "_" + (new Date().getDate()),//
        transaction_id: "A09022011",//
        jsonData: JSON.stringify(reqData)
      }
      var columns = [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '文件名', key: 'name', render: function (createElement, params) {
          return createElement('a', {
            on: {
              click: function () {
                var atchSN = params.row.sn
                var _reqData = {};
                _reqData.OPER_CODE = window.OPER_CODE;
                _reqData.OPER_NAME = window.OPER_FULL_NAME;

                _reqData.atchSN = atchSN;
                var req = P2.simpleTx("A09022015", _reqData, function(){}, function(){});
                req.success(function(data){
                  var relativePath = "resp";
                  var filename = data._COMMON.FILE_LIST_PACK.FILE_INFO.FILE_NAME;
                  var dlname_arr = data.ATCH_NM.split("."), dlname;
                  if (dlname_arr.length <= 2) {
                    dlname = dlname_arr[0]
                  } else {
                    dlname_arr.pop()
                    dlname = dlname_arr.join(".")
                  }

                  var url = "getLocalFile.action?openFile=false&charset=UTF8&relativePath=" + relativePath
                    + "&fileName=" + encodeURIComponent(filename) + "&dlFileName="
                    + encodeURIComponent(dlname);

                  // window.open(url)
                  location.href = url;
                }).error(function(d, reason){
                  if(reason != "abort") {

                    if(d.BK_DESC_DETAIL && d.BK_DESC_DETAIL.indexOf('返回代码为=-2001') > 0) {
                      P2.utils.showErrorMessage("下载失败，服务器上的文件不存在。", "error");
                    } else {
                      P2.utils.showErrorMessage("下载文件失败，请稍后重试。", "error");
                    }

                  }
                })
              }
            }
          }, params.row.name)
        }
        },
        {title: '上传日期', key: 'date'},
        {
          title: '文件大小', key: 'size', render: function (h, params) {
          return h('div', self.renderSize(params.row.size))
        }
        },
        {title: '上传人', key: 'user'},
        {title: '状态', key: 'state'}
      ]
      if (this.mode == "edit") {
        columns.push({
          title: "操作", key: "edit", render: function (createElement, params) {
            var innerHTML = []
            innerHTML.push(
              createElement('a', {
                'class': {
                  uploaderAtchDel: true
                },
                attrs: {
                  href: 'javascript:void(0)'
                },
                on: {
                  click: function () {
                    if (self.editMode_ == 'owner') {
                      if (!params.row['sn'] || params.row['user_id'] == window.OPER_CODE) {
                        self.$Modal.confirm({
                          title: "确认",
                          content: "<p>确认删除" + params.row.name + "?</p>",
                          onOk: function () {
                            self.removeUploadedFile(params.row['id'])
                          },
                        })

                      } else {
                        self.$Notice.error({
                          title: '删除失败',
                          desc: '您无权删除其他用户的附件'
                        });
                      }
                    }
                    if (self.editMode_ === 'free') {
                      self.$Modal.confirm({
                        title: "确认",
                        content: "<p>确认删除" + params.row.name + "?</p>",
                        onOk: function () {
                          self.removeUploadedFile(params.row['id'])
                        },
                      })
                    }
                  }
                }
              }, "删除")
            )
            return createElement(
              'div',
              innerHTML
            )
          }
        })
      }

      var _bsnId = this.bsnId || '',
        _bsnType = this.bsnType || '',
        _bsnName = this.bsnName || '',
        _mode = this.mode || 'view',
        _editMode = this.edtiMode || 'owner',
              _atchTplItmId = this.atchTplItmId || ''

      var styleObj = {}
      if(this.mode == 'single')
              styleObj['display'] = 'inline-block'
      return {
        files: [],
        uploadedFiles: [],
        ref: ref,
        columns: columns,
        post_data: initFormData,
        isIE9: isIE9,
        'category_': this.category,
        'bsnId_': _bsnId,
        'bsnType_': _bsnType,
        'bsnName_': _bsnName,
        'mode_': _mode,
        'editMode_': _editMode,
        'atchTplItmId_':this.atchTplItmId,
         styleObj:styleObj
      }
    },
    mounted: function () {
      if (this.mode!='single' && this.bsnId_ && this.bsnType_) {
        this.load()
      }
    },
    methods: {
      inputHandler: function (newFile, oldFile) {
        if (newFile && !oldFile) {
          // add
          // 添加文件, 置active为true, 触发上传
          var post_data = Object.assign({}, this.post_data, {
            jsonData: JSON.stringify({
              OPER_CODE: window.OPER_CODE,
              OPER_NAME: window.OPER_FULL_NAME,
              atchTplItmId:this.atchTplItmId,
              bsnNm:this.bsnName,
              bsnType: this.bsnType,
              bsnId: this.bsnId
            })
          })
          var data = Object.assign({}, post_data, {
            name: newFile.name,
            //size: newFile.size,
            type: newFile.type,
            lastModifieDate: new Date(),
          })
          this.$refs[this.ref].update(newFile, {data: data})
          this.$refs[this.ref].active = true
          if(this.mode!='single'){
            this.uploadedFiles.push(newFile)
            this.modifyUploadedFile(newFile.id, {state: "上传中..."})
          }
        }
        if (newFile && oldFile) {
          // update

          if (newFile.error && !oldFile.error) {
            // error
            // 监控到错误, 置active为false, 终止上传, 并处理错误
            this.$refs[this.ref].active = false
            if(this.mode!='single')
              this.modifyUploadedFile(newFile.id, {state: "上传失败"})
          }

          if (newFile.progress !== oldFile.progress) {
            // progress
            // 监控上传过程

          }

          if (newFile.success && !oldFile.success) {
            // success
            // 监控到成功, 置active为false, 终止上传, 并处理成功
            this.$refs[this.ref].active = false
            if (!this.isIE9) {
              var resp = JSON.parse(newFile.response)
            } else {
              var resp = newFile.response.replace("<pre>", "")
              resp = resp.replace("</pre>", "")
              resp = JSON.parse(resp)
            }

            if (resp['BK_STATUS'] == "00") {
              //上传成功
              if(this.mode!='single'){
                this.modifyUploadedFile(newFile.id, {state: "已上传"})
                this.modifyUploadedFile(newFile.id, {user: resp['ATCH_GRP']['ATCH_VDO'][0]['UDT_PSN_NM']})
                this.modifyUploadedFile(newFile.id, {user_id: resp['ATCH_GRP']['ATCH_VDO'][0]['UDT_PSN_ID']})
                this.modifyUploadedFile(newFile.id, {date: resp['ATCH_GRP']['ATCH_VDO'][0]['UDT_TM']})
                this.modifyUploadedFile(newFile.id, {sn: resp['ATCH_GRP']['ATCH_VDO'][0]['SN']})
              }
              this.$emit("done", resp)
              if(this.done)
                      this.done(resp)
            } else {
              //后端返回错误信息
              this.$refs[this.ref].update(newFile, {error: true})
              this.$refs[this.ref].update(newFile, {success: ""})
              if(this.mode!='single') {
                this.modifyUploadedFile(newFile.id, {state: "上传失败"});
              }
              this.$emit("error", resp)
              if(this.error)
                      this.error(resp)
            }
          }

        }

        if (!newFile && oldFile) {
          // remove
        }

      },
      getSN: function () {
        var sns = []
        for (var i in this.uploadedFiles) {
          if (this.uploadedFiles[i].sn) {
            sns.push(this.uploadedFiles[i]['sn'])
          }
        }
        return sns
      },
      modifyUploadedFile: function (id, obj) {
        for (var i = 0, len = this.uploadedFiles.length; i < len; i++) {
          if (this.uploadedFiles[i]['id'] && this.uploadedFiles[i]['id'] == id) {
            this.uploadedFiles[i] = Object.assign(this.uploadedFiles[i], obj)
            this.$set(this.uploadedFiles, i, this.uploadedFiles[i]);
            break;
          }
        }
      },
      removeUploadedFile: function (id) {
        for (var i = 0, len = this.uploadedFiles.length; i < len; i++) {
          if (this.uploadedFiles[i]['id'] && this.uploadedFiles[i]['id'] == id) {
            this.uploadedFiles.splice(i, 1)
            break;
          }
        }
      },
      renderSize: function (value) {
        if (null == value || value == '') {
          return " - ";
        }

        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var index = 0;

        var srcsize = parseFloat(value);

        var size = Math.floor(srcsize / Math.pow(1024, (index = Math.floor(Math.log(srcsize) / Math.log(1024)))), 2);
        return size + unitArr[index];
      },
      load: function (bsnId, bsnType, atchTemplateType) {
        var self = this;
        var _bsnId = bsnId || this.bsnId_
        var _bsnType = bsnType || this.bsnType_
        this.bsnId_ = _bsnId
        this.bsnType_ = _bsnType
        if (this.bsnId_ && this.bsnType_) {
          var reqData = {
            OPER_CODE: window.OPER_CODE,
            OPER_NAME: window.OPER_FULL_NAME,
            queryList: [{
              bsnId: _bsnId,
              bsnType: _bsnType,
              atchTemplateType: atchTemplateType || ""
            }],
            sortField: 'udtTm',
            sortType: 'asc',
            _pagination: {
              sortFields: [{'nm': 'udtTm', 'asc': 'asc'}]
            }
          }
          P2.simpleTx("A09022013", reqData).done(function (resp) {
            var atchList = resp.ATCH_GRP.ATCH_VDO || []
            for (var i = 0, len = atchList.length; i < len; i++) {
              self.uploadedFiles.push({
                name: atchList[i]['ATCH_NM'],
                date: atchList[i]['UDT_TM'],
                //size: self.renderSize(atchList[i]['ATCH_SZ']),
                user: atchList[i]['UDT_PSN_NM'],
                user_id: atchList[i]['UDT_PSN_ID'].trim(),
                sn: atchList[i]['SN'],
                state: "已上传",
                id: atchList[i]['SN']
              })
            }
          })
        }

      },
      save: function (bsnId, bsnType) {
        var _bsnId = bsnId || this.bsnId_ || ""
        var _bsnType = bsnType || this.bsnType_ || ""
        this.bsnId_ = _bsnId
        this.bsnType_ = _bsnType
        var reqData = {
          OPER_CODE: window.OPER_CODE,
          OPER_NAME: window.OPER_FULL_NAME,
          bsnId: _bsnId,
          bsnType: _bsnType,
          atchIds: this.getSN()
        }
        return P2.simpleTx("A09022014", reqData)
      }
    },
    watch: {
      category: function (nv, ov) {
        this.category_ = nv
      },
      bsnId: function (nv, ov) {
        this.bsnId_ = nv
      },
      bsnType: function (nv, ov) {
        this.bsnType_ = nv
      },
      mode: function (nv, ov) {
        this.mode_ = nv
      }
    }
  }
</script>
