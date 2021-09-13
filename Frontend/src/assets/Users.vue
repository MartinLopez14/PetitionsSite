<template>
  <div>
    Users ​Page
  </div>
</template>

<script>
  export default {
    data (){
      return {
        error: "",
        errorFlag: false,
        users: []
      }
    },
    mounted: function() {
      this.getUsers();
    },
    method: {
      getUsers: function() {
        this.$http.get('http://localhost/api/users')
        .then((response) => {
          this.users.response.data;
        })
        .catch((error) => {
          this.error = error;
          this.errorflag = true;
        })
      }
    }
  }
</script>
