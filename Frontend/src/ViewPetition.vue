<template>
  <div v-if="$route.params.petitionId">
    <div>
      <b-row align-h="start" >
        <b-button @click="goBack" >Back To Petitions</b-button>
      </b-row>

      <br /><br />
      <b-img :src="'http://localhost:4941/api/v1/petitions/' + chosenPetition.petitionId + '/photo'" height="500px"></b-img>
      <h1>{{chosenPetition.title}}</h1>
      <b-card>
        <div>{{chosenPetition.description}}</div>
      </b-card>
      <b-row>
        <b-col cols="6" offset-md="1">
          <b-row>
            <b-col cols="4" offset-md="1">
              <b-avatar :src="'http://localhost:4941/api/v1/users/' + chosenPetition.authorId + '/photo'" size="6rem"></b-avatar>
            </b-col>
            <b-col cols="3">
              <b-row><label>{{chosenPetition.authorName}}</label></b-row>
              <b-row>{{chosenPetition.authorCity}}</b-row>
              <b-row>{{chosenPetition.authorCountry}}</b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <b-col sm="3">
              <b-btn v-if="this.signed === false && this.isAuthor === false && editable" @click="signPetition()" size="lg">Sign</b-btn>
              <b-btn v-if="this.signed && this.isAuthor === false && editable" @click="deleteSignature()">UnSign</b-btn>
            </b-col>
            <b-col offset-md="2"><h2>{{chosenPetition.signatureCount}} have signed.</h2></b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4" offset-md="1" >
          <b-row>Category: {{chosenPetition.category}}</b-row>
          <b-row>Created: {{createdDate}}</b-row>
          <b-row v-if="chosenPetition.closingDate">Closing: {{closingDate}}</b-row>
          <b-row v-else>No closing date. </b-row>
          <!--     If editable, this will show    -->
          <b-row v-if="isAuthor && editable">
            <b-col><b-btn v-if="editable" @click="goToEdit">Edit Petition</b-btn></b-col>
            <b-col><b-btn @click="deletePetition()">Delete Petition</b-btn></b-col>
          </b-row>

        </b-col>
        <b-col>
          <b-table :items="signatories" :fields="signatoriesFields">
            <template v-slot:cell(name)="user">
              <b-avatar :src="'http://localhost:4941/api/v1/users/' + user.item.signatoryId + '/photo'"></b-avatar> {{ user.item.name }}
            </template>
          </b-table>
        </b-col>
      </b-row>
      <div></div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ViewPetition",
      data() {
          return {
            chosenPetition: "",
            isAuthor: false,
            editable: true,
            signed: false,
            createdDate: "",
            closingDate: "",
            signatories: [],
            signatoriesFields: [{ key: "name" }, { key: "city" }, { key: "country" }]
          }
      },
      mounted: function() {
        this.getPetitionData();
      },
      methods: {

        getPetitionData: function() {

          var petitionId = this.$route.params.petitionId;
          this.axios.get('http://localhost:4941/api/v1/petitions/' + petitionId)
            .then((response) => {
              this.chosenPetition = response.data;
              this.parseDates();
              this.getSignatures();
              this.isAuthor = parseInt(this.chosenPetition.authorId) === parseInt(this.$cookies.get('profileId'));

              let now = new Date();
              this.editable = false;
              if (this.$cookies.get('token')) {
                if(this.chosenPetition.closingDate === null) {
                  this.editable = true;
                } else if ( Date.parse(this.chosenPetition.closingDate) >= now) {
                  this.editable = true;
                }

              }

              this.$router.push('/petitions/' + petitionId);
            });
        },
        goToEdit: function() {
          var petitionId = this.chosenPetition.petitionId;
          this.$router.push("/petitions/" + petitionId + '/edit')
        },
        deletePetition: function() {
          let petitionId = this.chosenPetition.petitionId;
          if (parseInt(this.chosenPetition.authorId) === parseInt(this.$cookies.get('profileId'))) {
            this.axios.delete('http://localhost:4941/api/v1/petitions/' + petitionId, {
              headers: {
                'X-Authorization': this.$cookies.get('token')
              }
            })
              .then((response) => {
                this.$router.go(-1);
              }).catch((error) => {
                alert(error);
            })
          }
        },
        signPetition: function() {
          console.log("add");
          let petitionId = this.chosenPetition.petitionId;
          let authToken = this.$cookies.get('token');
          console.log(authToken);
          this.axios.post('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures', {}, {
            headers: {
              'X-Authorization': authToken
            }
          })
            .then((response) => {
              this.signed = true;
              this.getSignatures();
              this.chosenPetition.signatureCount += 1;
            })
        },
        deleteSignature: function() {
          console.log("delete");

          let petitionId = this.chosenPetition.petitionId;
          let authToken = this.$cookies.get('token');
          console.log(authToken);
          this.axios.delete('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures', {
            headers: {
              'X-Authorization': authToken
            }
          })
            .then((response) => {
              this.signed = false;
              this.getSignatures();
              this.chosenPetition.signatureCount -= 1;
            })
        },

        parseDates: function() {
          if (this.chosenPetition !== "") {
            let parseCreate =  new Date(this.chosenPetition.createdDate);
            this.createdDate = parseCreate.toUTCString();
            if (this.chosenPetition.closingDate) {
              let parseClose =  new Date(this.chosenPetition.closingDate);
              this.closingDate = parseClose.toUTCString();
            }
          }
        },
        removeCategory: function() {
          this.chosenCategory = {categoryId: 0, name: "Category"}
        },
        getSignatures: function() {
          var profileId = this.$cookies.get('profileId');
          this.axios.get('http://localhost:4941/api/v1/petitions/' + this.chosenPetition.petitionId + '/signatures')
            .then((response) => {
              this.signatories = response.data;
              for (var i = 0; i < response.data.length; i++) {
                if (parseInt(response.data[i].signatoryId) === parseInt(profileId)) {
                  this.signed = true;
                }
              }
            })
        },
        goBack: function() {
          this.$router.go(-1);
        }

      }
    }
</script>

<style scoped>

</style>
