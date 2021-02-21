<template lang="pug">
  #login
    .form-wrapper
      el-form.form(:model="form" ref="validateForm" :rules="rules" label-position="left" label-width="60px" class="demo-ruleForm" @submit.native.prevent)
        el-form-item(label="姓名" prop="name")
          el-input(type="text" v-model="form.name" @keyup.native.enter="submitForm('validateForm')")
        el-form-item(style="margin-bottom: 0;")
          el-button(type="primary" @click="submitForm('validateForm')") 確認
          el-button(@click="resetForm('validateForm')") 重置
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '姓名不能為空'}
          ]
        },
        form: {
          name: '',
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            window.sessionStorage.setItem('name', this.form.name);
            this.$router.push({ name: 'Home' })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  }
</script>

<style lang="scss">
  #login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .form-wrapper {
      min-height: 300px;
      padding: 20px;
      background-color: white;
      display: flex;
      align-items: center;
      width: 80%;
      background-color: white;

      .form {
        width: 100%;
      }
    }
  }
</style>