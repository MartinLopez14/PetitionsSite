<template>
  <div>
    <div class="container">
      <b-container fluid>
        <b-row>
          <b-col>
            <h1>Register</h1>
            <hr>
          </b-col>
        </b-row>
        <b-form novalidate @submit.stop.prevent="onSubmit">
          <b-row class="my-1">
            <b-col sm="4">
              <label>Name</label>
              <b-form-input id="name" placeholder="Enter name" :state="validateState('name')" v-model ="name" required trim></b-form-input>
              <b-form-invalid-feedback>Invalid Name</b-form-invalid-feedback>
              <b-form-text>Required</b-form-text>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="12">
              <label>Email address</label>
              <b-form-input id="email" type="email" placeholder="Enter email address" :state="validateState('primary_email')" v-model ="email" required trim ></b-form-input>
              <b-form-invalid-feedback>bad</b-form-invalid-feedback>
              <b-form-text>Required</b-form-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <label>City</label>
              <b-form-input id="city" placeholder="Enter city (Optional)" :state="validateState('city')" v-model ="city" trim></b-form-input>
              <b-form-invalid-feedback>Invalid City</b-form-invalid-feedback>
            </b-col>
            <b-col sm="4">
              <label>Country</label>
              <b-form-input id="country" placeholder="Enter country (Optional)" :state="validateState('city')" v-model ="country" trim></b-form-input>
              <b-form-invalid-feedback>Invalid Country</b-form-invalid-feedback>
            </b-col>
          </b-row>
          <b-row>
            <label>photo stuff</label>
          </b-row>
          <b-row class="my-1">
            <b-col sm="6">
              <label>Password</label>
              <b-form-input type="password" id="password" placeholder="Enter password" :state="validateState('password')" v-model ="password" required></b-form-input>
              <b-form-invalid-feedback> Password must contain at least 8 characters with at least one digit, one lower case, one upper case</b-form-invalid-feedback>
              <b-form-text>Required</b-form-text>
            </b-col>
            <b-col sm="6">
              <label>Repeat Password</label>
              <b-form-input id="passwordRepeat" type="password" placeholder="Enter password again" :state="validateState('passwordRepeat')" v-model ="passwordRepeat" required></b-form-input>
              <b-form-invalid-feedback id="email-error"> Passwords must be the same</b-form-invalid-feedback>
              <b-form-text>Required</b-form-text>
            </b-col>
          </b-row>
          <b-button type="submit" variant="primary" >Submit</b-button>
        </b-form>
      </b-container>
    </div>
  </div>
</template>

<script>

  const nameValidate = helpers.regex('nameValidate', /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/); // Some names have ' or - or spaces so can't use alpha
  const passwordValidate = helpers.regex('passwordValidate', new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$"));

  import { validationMixin } from "vuelidate";
  import {alphaNum, email, helpers, required, sameAs} from 'vuelidate/lib/validators'

  export default {
    components: {
      //NavBar
    },
      data() {
        return {
          name: null,
          email: null,
          password: null,
          passwordRepeat: null,
          city: null,
          country: null
        }
      },
      validations: {
        name: {
          required,
          nameValidate
        },

        email: {
          required,
          email,
        },
        password: {
          required,
          passwordValidate
        },
        passwordRepeat: {
          required,
          sameAsPassword: sameAs('password')
        },
        city: {
          nameValidate
        }
      },
      methods: {
        validateState: function(name) {
          const { $dirty, $error } = name;
          return $dirty ? !$error : null;
        },
        onSubmit: function() {
          let currentObj = this;
          let email = this.email;
          let password = this.password;
          let registerData = {};
          if (this.name) {registerData['name'] = this.name}
          if (this.email) {registerData['email'] = email}
          if (this.password) {registerData['password'] = password}
          if (this.city) {registerData['city'] = this.city}
          if (this.country) {registerData['country'] = this.country}
          this.axios.post('http://localhost:4941/api/v1/users/register', registerData)
          .then(function(response) {
            // login in automatically after registering
            let loginData = {'email': email, 'password': password};
            currentObj.axios.post('http://localhost:4941/api/v1/users/login', loginData)
            .then((response) => {
              currentObj.$cookies.set('profileId', response.data.userId, '3h');
              currentObj.$cookies.set('token', response.data.token, '3h');
              currentObj.$router.push('/viewProfile')
            }).catch((error) =>{
              alert(error)
            })

          }).catch((error) =>{
            alert(error)
          })
          // This needs to log the user in, hence give them auth token and push to user page.
        },

      }

  }
</script>

<style scoped>

</style>
