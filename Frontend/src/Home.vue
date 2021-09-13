<template>
  <div id="app">
    <h1>Login</h1>
    <b-card>
      <b-form-group>
        <b-form-input v-model="email" id="emailInput" placeholder="Enter email" :state="emailState"></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input  type="password" v-model="password" id = "passwordInput" placeholder="Password1" :state="passwordState"></b-form-input>
      </b-form-group>
      <b-container class="b-container">
        <b-button @click="submit">Submit</b-button>
      </b-container>
      <b-container class="b-container">
        <a href="/register" id="signup-link">Register</a>
      </b-container>
    </b-card>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    components: {
    },
    computed: {
      emailState() {
        let state = null;
        if (this.submitted) {
          if (this.email.length > 3) {
            let pattern = new RegExp("^($|[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+)$");
            state = pattern.test(this.email);
          } else {
            state = false;
          }
        }
        if (!this.submitted) {
          state = null;
        }
        return state;
      },
      passwordState() {
        let state = null;
        if (this.submitted) {
          if (this.password.length === 0) {
            state = false;
          } else {
            state = true;
          }
        }
        if (!this.submitted) {
          state = null;
        }
        return state;
      }
    },
    data() {
      return {
        email: "",
        password: "",
        submitted: false
      }
    },
    methods: {
      submit(e) {
        console.log(this.$cookies.get('token'));
        this.submitted = true;
        if (this.emailState && this.passwordState) {
          //obj.axios.defaults.withCredentials = true;
          let loginData = {'email': this.email, 'password': this.password};
          this.axios.post('http://localhost:4941/api/v1/users/login', loginData)
            .then((response) => {
              this.$cookies.set('profileId', response.data.userId, '3h');
              this.$cookies.set('token', response.data.token, '3h');
              this.$router.push('/viewProfile')
            }).catch((error) => {
            alert(error)
          })
        }
      },
    }
  }

</script>


<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  [v-cloak] {
    display: none;
  }

  .container {
    background-color: #f2f2f2;
    padding: 5px 40px 15px 20px;
    border: 1px solid lightgrey;
    border-radius: 3px;
  }

  #user-error-feedback {
    color: red;
    padding-top: 10px;
  }

  .b-container {
    background-color: white;
    border: 0 white;
  }
</style>
