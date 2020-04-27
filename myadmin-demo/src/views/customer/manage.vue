<template>
  <div class="app-container">
    <div class="search">
      <div class="search_left">
        <span>客户搜索：</span>
        <input id="sear" v-model="filterInput" type="text" placeholder="请输入用户名">
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
      <el-table-column align="center" label="用户名" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="110">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业名称" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.com_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.timestamp |parseTime() }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.note }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="70" prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
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
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="90px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="企业名称:" prop="com_name">
          <el-input v-model="form.com_name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="初始密码:" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱:" prop="emil">
          <el-input v-model="form.emil" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="登录方式:" prop="methods">
          <el-radio-group v-model="form.methods">
            <el-radio :label="1">账号密码</el-radio>
            <el-radio :label="2">钉钉</el-radio>
            <el-radio :label="3">企业微信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间:" prop="timestamp">
          <el-date-picker v-model="form.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import { getProductsdata, deleteIddata } from '@/network/products'

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
        com_name: '',
        name: '',
        password: '',
        phone: '',
        emil: '',
        note: '',
        desc: '',
        status: true,
        methods: 1,
        timestamp: new Date()
      },
      dialogStatus: '',
      textMap: {
        update: '编辑客户',
        create: '添加客户'
      },
      rules: {
        com_name: [
          { required: true, message: '请输入企业名称', trigger: 'change' },
          { min: 3, message: '最少 3 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 2, message: '最少 2 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '最少 6 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' }
        ],
        emil: [
          { required: true, message: '请输入邮箱', trigger: 'change' }
        ],
        note: [
          { required: true, message: '备注不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getProductsdata()
  },
  methods: {
    deletepro(id) {
      deleteIddata(id).then(res => {
        this.getProductsdata()
      })
    },
    getProductsdata() {
      this.listLoading = true
      getProductsdata().then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    resetForm() {
      this.form = {
        id: undefined,
        com_name: '',
        name: '',
        password: '',
        phone: '',
        emil: '',
        note: '',
        desc: '',
        status: true,
        methods: 1,
        timestamp: new Date()
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
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const newdata = {
            id: undefined,
            com_name: this.form.com_name,
            name: this.form.com_name,
            password: this.form.password,
            phone: this.form.phone,
            emil: this.form.emil,
            note: this.form.note,
            desc: this.form.desc,
            status: this.form.status,
            methods: this.form.methods,
            timestamp: new Date()
          }
          axios.post('http://localhost:3000/list', newdata).then(() => {
            this.dialogFormVisible = false
            this.getProductsdata()
          })
        }
      })
    },
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const updatas = Object.assign({}, this.form)
          axios.put('http://localhost:3000/list/' + updatas.id, updatas).then(res => {
            this.getProductsdata()
            this.dialogFormVisible = false
          })
        }
      })
    },
    lists(list, filterInput) {
      if (list) {
        return list.filter(res => {
          return res.name.match(filterInput)
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
</style>
