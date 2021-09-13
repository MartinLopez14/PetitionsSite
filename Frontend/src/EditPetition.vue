<template>
  <b-container>
    <b-row>
      <div v-if="this.petitionImage">
        <b-col id="image-remove-input_group" label="Current Image" v-if="this.petitionImage" align="center">
          <b-img align="center" :src="'http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId + '/photo'" height="300px"></b-img>
        </b-col>
      </div>
    </b-row>
    <b-row>
      <b-col><h1>Choose Petition Image</h1></b-col>
      <b-col id="image-input-group" label="Upload Image" label-for="image-input">
        <b-form-file accept="image/jpeg, image/png, image/gif" v-model="petitionImage" aria-describedby="image-feedback"></b-form-file>
        <b-form-invalid-feedback id="image-feedback">Image must be a JPG, PNG or GIF.</b-form-invalid-feedback>
        <b-button @click="replaceImage()">Change Image</b-button>
      </b-col>
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
        </div>
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
    name: "EditPetition",
    data() {
      return {
        petitionId: null,
        title: '',
        description: '',
        heroImage: null,
        categories: [],
        chosenCategory: {categoryId: 0, name: "Category"},
        success: null,
        error: null,
        closingDate: null,
        isAuthor: false,
        petitionImage: null
      }
    },
    mounted: function() {
      this.checkLoggedInAndAuthor();
    },
    methods: {
      validateDurationState(name) {
        const {$dirty, $error} = this.$v.durationForm[name];
        return $dirty ? !$error : null;
      },
      checkLoggedInAndAuthor: function() {
        this.getCategories();
        if(!this.$cookies.get('token')) {
          this.$router.push('/');
          return;
        }
        this.petitionId = this.$route.params.petitionId;
        this.axios.get('http://localhost:4941/api/v1/petitions/' + this.petitionId)
        .then((response) => {
          let now = new Date();
          if (parseInt(this.$cookies.get('profileId')) !== parseInt(response.data.authorId)) {
            this.$router.push('/petitions');
          } else {
            this.title = response.data.title;
            this.description = response.data.description;
            this.getCategoryFromResponse(response.data.category);
            if (response.data.closingDate !== null) {
              this.closingDate = new Date(response.data.closingDate)
              if (now > this.closingDate) {
                this.$router.push('/petitions');
              }
            }
            this.getImage();
            console.log(this.chosenCategory);
          }
        })
      },
      getCategoryFromResponse: function(name) {
        for (var i = 0; i <this.categories.length; i++) {
          if (this.categories[i].name === name) {
            this.chosenCategory = this.categories[i];
          }
        }
      },
      onSubmit: function() {
        this.success = null;
        this.error = null;
        if (this.checkClosingDate() && this.chosenCategory.categoryId !== 0) {
          let patchData = {
            'title': this.title,
            'description': this.description,
            'categoryId': this.chosenCategory.categoryId,
          };
          if (this.closingDate) {
            patchData['closingDate'] = this.closingDate;
          }
          console.log(patchData);
          this.axios.patch('http://localhost:4941/api/v1/petitions/' + this.petitionId, patchData, {
            headers: {
              'X-Authorization': this.$cookies.get('token')
            }
          }).then((response) => {
            console.log("saved the edit");
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
      },
      replaceImage: function() {
        this.success = null;
        this.error = null;

        this.axios.put('http://localhost:4941/api/v1/petitions/' + this.petitionId + '/photo', this.petitionImage, {
          headers: {
            'Content-Type': this.petitionImage.type,
            'X-Authorization': this.$cookies.get('token')
          }
        })
          .then((response) => {
            this.success = 'Saved Image';
            console.log("done");
            this.getImage();
          })
          .catch((err) => {
            alert(err);
          });
      },
      getImage: function() {
        this.petitionImage = null;
        this.axios.get('http://localhost:4941/api/v1/petitions/' + this.petitionId + '/photo', { responseType: 'blob' })
          .then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response.data);
            reader.onload = () => {
              this.petitionImage = reader.result;
            }
          })
          .catch(err => {
          });
      }
    }
  }
</script>

<style scoped>

</style>
