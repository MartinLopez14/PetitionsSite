<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{error}}
    </div>

<!--  Searching Petitions  -->
    <div v-else>
      <div>
        <b-row>
        <b-col sm="4" style="alignment: left"><b-btn style="alignment: left" href="/createPetition" v-if="this.$cookies.get('token')">Create Petition</b-btn></b-col>
        <b-col sm="4"><h1>Petitions</h1></b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4"><b-input v-model="searchQuery" placeholder="Search Petitions"></b-input></b-col>
            <b-col sm="2">Category: </b-col>
            <b-col sm="2">
              <b-dropdown :text="chosenCategory.name">
                <b-dropdown-item v-for="category in this.categories" @click="chosenCategory = category">{{category.name}}</b-dropdown-item>
              </b-dropdown>
            </b-col>
            <b-col sm="2">Sort: </b-col>
            <b-col sm="2">
              <b-dropdown :text="sortBy.name">
                <b-dropdown-item v-for="sort in this.sortOptions" @click="sortBy = sort">{{sort.name}}</b-dropdown-item>
              </b-dropdown>
            </b-col>
          </b-row>
          <b-row>
            <b-col><b-btn @click="searchPetitions">Search</b-btn></b-col>
          </b-row>
        </b-card>
        <b-card>
          <b-table stripe hover :items="petitionRows" :fields="tableFields" class="clickable" @row-clicked="goToPetition">
            <template v-slot:cell(image)="data">
              <b-avatar :src="'http://localhost:4941/api/v1/petitions/' + data.item.petitionId + '/photo'"></b-avatar>
            </template>
          </b-table>
          <b-row v-if="this.petitionRows">
            <b-col>
              <b-pagination
                v-model="currentPage"
                :total-rows="maxCount"
                :per-page="pageMax"
                @input="searchPetitions()"
              ></b-pagination>
            </b-col>
          </b-row>
        </b-card>
      </div>
    </div>

  </div>
</template>


<script>
  export default {
    data (){
      return {
        error: "",
        errorFlag: false,
        categories: [],
        sortOptions: [{sortId: 'SIGNATURES_DESC', name: 'Descending Signatures'},
                      {sortId: 'SIGNATURES_ASC', name: 'Ascending Signatures'},
                      {sortId: 'ALPHABETICAL_DESC', name: 'Title Z-A'},
                      {sortId: 'ALPHABETICAL_ASC', name: 'Title A-Z'}],
        // default search parameters
        searchQuery: "",
        chosenCategory: {categoryId: 0, name: "Category"},
        sortBy: {sortId: 'SIGNATURES_DESC', name: 'Descending Signatures'},
        pageMax: 10,
        pageAmount:1,
        startIndex: 1,
        currentPage: 1,
        maxCount: 1,
        // data returned
        tableFields: ['title','category','authorName','signatureCount','image'],
        petitionRows: [],
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
      // Will load most signed signatures at first load of page, just for the user to have something to look at
      this.searchPetitions();
      this.getCategories();
      if (this.$route.params.petitionId) {
        this.getSignatures();
      }
    },

    methods: {

      searchPetitions: function() {
        this.petitionRows = [];

        let searchParams = {
          'startIndex': (this.currentPage - 1) * this.pageMax,
          'count': this.pageMax,
          'sortBy': this.sortBy.sortId
        };
        if (this.searchQuery.length > 0) {
          searchParams['q'] = this.searchQuery;
        }
        if (this.chosenCategory.categoryId !== 0) {
          searchParams['categoryId'] = this.chosenCategory.categoryId;
        }

        this.axios.get('http://localhost:4941/api/v1/petitions', {params: searchParams})
          .then((response) => {
            this.petitionRows = response.data;
            this.removeCategory();
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
        this.getMaxCount();
        console.log(this.maxCount);
      },
      getMaxCount() {
        let countParams = {};
        if (this.searchQuery.length > 0) {
          countParams['q'] = this.searchQuery;
        }
        if (this.chosenCategory.categoryId !== 0) {
          countParams['categoryId'] = this.chosenCategory.categoryId;
        }

        this.axios.get('http://localhost:4941/api/v1/petitions', {
          params: countParams
        })
        .then((response) => {

          this.maxCount = response.data.length;
        })
        .catch(err => alert(err));
      },

      goToPetition: function(chosenRow, index, event) {
        this.chosenPetition = chosenRow;

        var petitionId = this.chosenPetition.petitionId;
        this.$router.push('/petitions/' + petitionId);
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
            console.log(this.categories);
          })
          .catch(err => alert(err));
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
      }


    }
  }

</script>

<style>

  .back_button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

</style>
