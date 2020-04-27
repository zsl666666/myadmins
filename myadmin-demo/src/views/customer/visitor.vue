<template>
  <div class="app-container vist">
    <div class="search">
      <div class="search_left">
        <span>客户搜索：</span>
        <input id="sear" v-model="filterInput" type="text" placeholder="请输入用户名" >
      </div>
      <div class="search_right">
        <el-button type="primary" size="small" @click="handleCreate">添加客户</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="lists(list,filterInput)"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.contact }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="110">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="来访时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.comeTime |parseTime() }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在城市" width="100">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP地址" width="120" prop="status">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="已联系" width="120" prop="status">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.contack_ok" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deletepro(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <div class="explain">
        <p>说明：</p>
        <p>1、客户通过的试用通道填入联系人和电话，此处表单会获取到记录。</p>
        <p>2、对于记录有已联系和删除两个功能。</p>
        <p>3、已联系就是对此条信息做一个标示，说明此用户已经进行过回访。</p>
        <p>4、所在城市是通过IP地址所识别到的。</p>
        <p>5、来访时间就是用户在官网提交表单的时间。</p>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="联系人:" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="来访时间:" prop="comeTime">
          <el-date-picker v-model="form.comeTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { deleteContack, getVisitorData } from '@/network/products'

export default {
  filters: {
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
        return value.toString().padStart(2, '0')
      })
      return time_str
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      filterInput: '',
      form: {
        id: undefined,
        contact: '',
        phone: '',
        comeTime: new Date(),
        city: '',
        ip: ''
      },
      dialogStatus: '',
      textMap: {
        create: '添加客户'
      },
      rules: {
        contact: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          { min: 3, message: '长度大于 3 个字符 ', trigger: 'blur' }
        ],
        comeTime: [
          { required: true, message: '请输入来访时间', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getVisitorData()
  },
  methods: {
    deletepro(id) {
      deleteContack(id).then(res => {
        this.getVisitorData()
      })
    },
    getVisitorData() {
      this.listLoading = true
      getVisitorData().then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    resetForm() {
      this.form = {
        id: undefined,
        contact: '',
        phone: '',
        comeTime: new Date(),
        city: '',
        ip: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const newdata = {
            id: undefined,
            contact: this.form.contact,
            phone: this.form.phone,
            city: '河南·南阳',
            ip: '223.90.114.213',
            contack_ok: false,
            comeTime: new Date()
          }
          axios.post('http://localhost:3000/devs', newdata).then(() => {
            this.dialogFormVisible = false
            this.getVisitorData()
          })
        }
      })
    },
    lists(list, filterInput) {
      if (list) {
        return list.filter(res => {
          return res.contact.match(filterInput)
        })
      }
    }
  }
}
</script>
<style lang="scss">
.el-table th{
  background: #f4f6f9 !important;
}
.vist{
  .el-dialog__header{
    position: relative;
    top: 235px;
    border-top:1px solid #DCDFE6;
  }
  .explain{
    font-size: 16px;
    padding-top: 20px;
    color: #000000;
  }
  .el-dialog__title{
    font-weight: 600;
  }
  .el-dialog {
    width: 40%;
  }
}
</style>
<style scoped>
.search{
  background-color: #fff;
  height: 56px;
  padding: 0 20px;
  line-height: 56px;
  font-size: 14px;
}
.search_left{
  color: #8c8e92;
  float: left;
}
#sear{
  font-size: 12px;
  padding: 8px 5px;
  border: 1px solid #e9e9e9;
  width: 240px;
  border-radius: 5px;
}
#sear::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #cccbcb;
}
#sear:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
   color: #cccbcb;
}
#sear::-moz-placeholder { /* Mozilla Firefox 19+ */
   color: #cccbcb;
}
#sear:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color: #cccbcb;
}
.search_right{
  float: right;
}
.el-table{
  padding:0 20px;
}
.el-table::before {
  width: 0;
}
.app-container{
  padding: 0;
  width: 100%;
  height: 100%;
  border: 20px solid #EBEEF5;
  background: #fff;
}
.el-dialog__header{
  position: relative;
  top: 134px;
  color: red;
}
.explain{
  position: relative;
  top: -100px;
}
</style>
