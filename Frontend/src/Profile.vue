<template>
  <div>
    <div v-if="$route.name === 'editProfile'" class="container">
      <b-container fluid>
        <b-alert v-if="this.success" variant="success" show>{{ this.success }}</b-alert>
        <b-alert v-if="this.error" variant="danger" show>{{ this.error }}</b-alert>
        <b-row>
          <b-col>
            <h1>Your Profile</h1>
            <div v-if="this.userImage">
              <b-col id="image-remove-input_group" label="Current Image" v-if="this.userImage">
                <b-img :src="'http://localhost:4941/api/v1/users/' + this.$cookies.get('profileId') + '/photo'"></b-img> <b-button @click="deleteImage()">Remove</b-button>
              </b-col>
            </div>
            <div v-else>
              <b-avatar></b-avatar>
            </div>

            <b-col id="image-input-group" label="Upload Image" label-for="image-input">
              <b-form-file accept="image/jpeg, image/png, image/gif" v-model="userImage" aria-describedby="image-feedback"></b-form-file>
          <b-form-invalid-feedback id="image-feedback">Image must be a JPG, PNG or GIF.</b-form-invalid-feedback>
          </b-col>
          <b-button @click="replaceImage()">Change Image</b-button>
          </b-col>

        </b-row>
        <b-form novalidate @submit.stop.prevent="saveProfileInfo">
          <div v-b-toggle="'info_collapse'" class="clickable">
            <b-container>
              <b-row>
                <b-col><h3 >Profile Info</h3></b-col>
                <b-col><h5 align="right">Change</h5></b-col>
              </b-row>
              <b-row>
                <b-col>Change your Info</b-col>
              </b-row>
            </b-container>
          </div>
          <b-collapse id="info_collapse">
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
                <b-form-input id="email" type="email" placeholder="Enter email address" :state="validateState('primary_email')" v-model ="newEmail" required trim ></b-form-input>
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
            <b-button type="submit" variant="primary" @click="saveProfileInfo">Submit</b-button>
          </b-collapse>
          <div v-b-toggle="'password_collapse'" class="clickable">
            <b-container>
              <b-row>
                <b-col><h3 >Password</h3></b-col>
                <b-col><h5 align="right">Change</h5></b-col>
              </b-row>
              <b-row>
                <b-col>Change your password</b-col>
              </b-row>
            </b-container>
          </div>
          <b-collapse id="password_collapse">
            <b-row>
              <b-col sm="6">
                <label>Current Password</label>
                <b-form-input type="password" id="password" placeholder="Enter current password" v-model ="password" ></b-form-input>
                <b-form-invalid-feedback> Password must contain at least 8 characters with at least one digit, one lower case, one upper case</b-form-invalid-feedback>
                <b-form-text>Required</b-form-text>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="6">
                <label>New Password</label>
                <b-form-input type="password" id="newPassword" placeholder="Enter new password" v-model ="newPassword"></b-form-input>
                <b-form-invalid-feedback> Password must contain at least 8 characters with at least one digit, one lower case, one upper case</b-form-invalid-feedback>
                <b-form-text>Required</b-form-text>
              </b-col>
            </b-row>
            <b-row>
              <b-button align="left" v-on:click="savePassword">Save Password</b-button>
            </b-row>
          </b-collapse>
        </b-form>
      </b-container>
    </div>

<!-- View Profile   -->

    <div v-else-if="$route.name === 'viewProfile'">

      <b-img v-if="this.userImage" :src="'http://localhost:4941/api/v1/users/' + this.$cookies.get('profileId') + '/photo'" height="300px" center></b-img>
      <b-avatar v-else></b-avatar>
      <h1>{{name}}</h1>
      <h2>{{email}}</h2>
      <h2 v-if="city">{{city}}</h2>
      <h2 v-if="country">{{country}}</h2>
      <b-btn  @click="goToEdit">Edit Profile</b-btn>
      <b-btn href="/myPetitions">My Petitions</b-btn>

    </div>
    <div v-else-if="$route.name === 'myPetitions'">
      <b-btn href="/viewProfile">Go back to Profile</b-btn>
      <b-card>
        <h1>My Petitions</h1>
        <b-table stripe hover :items="myPetitionRows" :fields="tableFields" class="clickable" @row-clicked="goToPetition">
          <template v-slot:cell(chosenPetition)></template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
    import {required} from "vuelidate";

    export default {
        name: "Profile",
      data () {
          return {
            profileId: null,
            name: null,
            email: null,
            newEmail: null,
            password: null,
            newPassword: null,
            city: null,
            country: null,
            myPetitionRows: null,
            tableFields: ['title','category','authorName','signatureCount','image'],
            userImage: null,
            success: null,
            error: null
          }
      },
      validations: {
        imageForm: {
          img: {
            required,
            validateImage(val) {
              if (val) {
                if (val.type === 'image/jpeg' || val.type === 'image/jpg' || val.type === 'image/png'
                  || val.type === 'image/gif') {
                  return true;
                }
              }
              return false;
            }
          }
        }
      },
      mounted() {
        this.getProfileData();
        this.searchPetitions();
      },
      methods: {
        validateImage() {
          const { $dirty, $error } = this.$v.imageForm['img'];
          return $dirty ? !$error : null;
        },
        getProfileData: function() {
          this.profileId = this.$cookies.get('profileId');
          this.axios.get('http://localhost:4941/api/v1/users/' + this.profileId, {
            headers: {
              'X-Authorization': this.$cookies.get('token')
            }
          })
            .then((response) => {
              this.name = response.data.name;
              this.email = response.data.email;
              this.newEmail= response.data.email;
              this.city = response.data.city;
              this.country = response.data.country;
              this.getImage();
            })
          .catch((error) => {
            this.$router.push('/');
          })
        },
        getImage: function() {
          this.userImage = null;
          this.axios.get('http://localhost:4941/api/v1/users/' + this.profileId + '/photo', { responseType: 'blob' })
          .then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response.data);
            reader.onload = () => {
              this.userImage = reader.result;
            }
          })
          .catch(err => {
          });
        },
        replaceImage: function() {
          this.success = null;
          this.error = null;

          this.axios.put('http://localhost:4941/api/v1/users/' + this.profileId + '/photo', this.userImage, {
            headers: {
              'Content-Type': this.userImage.type,
              'X-Authorization': this.$cookies.get('token')
            }
          })
          .then((response) => {
            this.success = 'Saved Image';
            console.log("done");
            this.getImage();
          })
          .catch((err) => {
            this.imageForm.error = 'Failed to save image';
            alert(err);
          });
        },
        deleteImage: function() {
          this.error = null;
          this.success = null;

          this.axios.delete('http://localhost:4941/api/v1/users/' + this.profileId + '/photo', {
            headers: {
              'X-Authorization': this.$cookies.get('token')
            }
          })
            .then((res) => {
              this.userImage = null;
              this.success = 'Successfully removed Image';
            })
            .catch(err => {
              this.error = 'Failed removing image';
              alert(err);
            });
        },
        validateState: function(name) {
          const { $dirty, $error } = name;
          return $dirty ? !$error : null;
        },
        searchPetitions: function() {
          this.myPetitionRows = [];
          var profileId = this.$cookies.get('profileId');
          var searchParams = {
            'authorId': profileId
          };
          this.axios.get('http://localhost:4941/api/v1/petitions', {params: searchParams})
            .then((response) => {
              console.log(response.data);
              this.myPetitionRows = response.data;
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            })
        },
        goToPetition: function(chosenRow, index, event) {
          this.chosenPetition = chosenRow;

          var petitionId = this.chosenPetition.petitionId;
          this.axios.get('http://localhost:4941/api/v1/petitions/' + petitionId)
            .then((response) => {
              this.chosenPetition = response.data;
              this.parseDates();
            });
          this.$router.push('/petitions/' + petitionId);
        },
        goToEdit: function() {
          this.$router.push('/editProfile');
        },
        savePassword: function() {
          this.success = null;
          this.error = null;
          let profileId = this.$cookies.get('profileId');

          let data = {
            'currentPassword': this.password,
            'password': this.newPassword
          };

          this.axios.patch('http://localhost:4941/api/v1/users/' + profileId, data, {
            headers: {
              'X-Authorization': this.$cookies.get('token')
            }
          }).then((response) => {
            this.success = 'Saved new password';
          })
            .catch((error) => {
              this.error = 'Failed to save password.';
              alert(error);
            });
        },
        saveProfileInfo: function() {
          this.success = null;
          this.error = null;
          let data = {
            'name': this.name,
            'email': this.newEmail
          };
          if (this.city) {
            data['city'] = this.city;
          }
          if (this.country) {
            data['country'] = this.country;
          }
          this.axios.patch('http://localhost:4941/api/v1/users/' + this.profileId, data, {
            headers: {
              'X-Authorization': this.$cookies.get('token')
            }
          })
            .then((res) => {
              this.success = 'Saved';
            })
            .catch(err => {
               if (this.email === this.newEmail) {
                 this.success = 'No data changed';
              } else {
                this.error = 'Email is already in use';
              }
            })
        }


      }

    }
</script>

<style scoped>

</style>
