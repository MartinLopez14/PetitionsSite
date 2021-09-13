<template>
  <b-container>
    <b-row>
    </b-row>
    <b-row >
        <h1>Title:</h1>
        <b-col><b-input v-model="title" placeholder="Petition Title"></b-input></b-col>
    </b-row>

    <b-row>
      <h1>Description</h1>
      <b-col>
          <b-textarea
            v-model="description"
            placeholder="What is the petition about?"
          ></b-textarea>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-dropdown :text="chosenCategory.name">
          <b-dropdown-item v-for="category in this.categories" @click="chosenCategory = category">{{category.name}}</b-dropdown-item>
        </b-dropdown>
      </b-col>
      <b-col>
        <div>
          <b-form-datepicker v-model="closingDate" locale="en"></b-form-datepicker>
          <b-btn @click="resetDate">Reset Date</b-btn>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col><h1>Choose Petition Image</h1></b-col>
      <b-col id="image-input-group" label="Upload Image" label-for="image-input">
        <b-form-file accept="image/jpeg, image/png, image/gif" v-model="petitionImage" aria-describedby="image-feedback"></b-form-file>
        <b-form-invalid-feedback id="image-feedback">Image must be a JPG, PNG or GIF.</b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row><b-button @click="onSubmit" variant="primary">Submit</b-button></b-row>
    <b-alert v-if="success" variant="success" show>{{ this.success }}</b-alert>
    <b-alert v-if="error" variant="danger" show>{{ this.error }}</b-alert>
  </b-container>
</template>

<script>
    import {required} from "vuelidate";

    export default {
      name: "CreatePetition",
      data() {
        return {
          profileId: null,
          title: '',
          description: '',
          heroImage: null,
          categories: [],
          chosenCategory: {categoryId: 0, name: "Category"},
          success: null,
          error: null,
          closingDate: null,
          petitionImage: null
        }
      },
      mounted: function() {
        this.checkLoggedIn();
        this.getCategories();
      },
      methods: {
        validateDurationState(name) {
          const {$dirty, $error} = this.$v.durationForm[name];
          return $dirty ? !$error : null;
        },
        checkLoggedIn: function() {
          if(!this.$cookies.get('token')) {
            this.$router.push('/');
          }
        },

        onSubmit: function() {
          this.success = null;
          this.error = null;
          console.log(this.title);
          if (this.checkClosingDate() && this.chosenCategory.categoryId !== 0) {
            let postData = {
              'title': this.title,
              'description': this.description,
              'categoryId': this.chosenCategory.categoryId
            };
            if (this.closingDate !== null) {
              postData['closingDate'] = this.closingDate;
            }
            this.axios.post('http://localhost:4941/api/v1/petitions', postData, {
              headers: {
                'X-Authorization': this.$cookies.get('token')
              }
            }).then((response) => {
              let petitionId = response.data.petitionId;
              this.axios.put('http://localhost:4941/api/v1/petitions/' + petitionId + '/photo', this.petitionImage, {
                headers: {
                  'Content-Type': this.petitionImage.type,
                  'X-Authorization': this.$cookies.get('token')
                }
              });
              this.axios.post('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures', {}, {
                headers: {
                  'X-Authorization': this.$cookies.get('token')
                }
              }).then((response) => {
                this.$router.push('/myPetitions')
              }).catch(error2 => alert(error2))
            }).catch(error1 => alert(error1))
          } else {
            this.error = "Check closing date is in the future and you have picked a category."
          }


        },
        checkClosingDate: function() {
          if (this.closingDate === null) {
            return true
          } else {
            let now = new Date();
            return now < Date.parse(this.closingDate);
          }
        },
        resetDate: function() {
          this.closingDate = null;
        },
        getCategories() {
          //this runs at mount of website to to get the current categories in the database, populate a dropdown with these
          this.axios.get('http://localhost:4941/api/v1/petitions/categories')
            .then((res) => {
              if (res.data.length === 0) {
                this.categories.push({categoryId: null, name: 'No categories in database'});
              } else {
                for (var i = 0; i < res.data.length; i++) {
                  this.categories.push({categoryId: res.data[i].categoryId, name: res.data[i].name});
                }
              }
            })
            .catch(err => alert(err));
        },
        validateDurationState() {
          const {$dirty, $error} = this.closingDate;
          return $dirty ? !$error : null;
        }
      }
    }
</script>

<style scoped>

</style>
