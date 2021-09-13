<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info" fixed>
      <b-navbar-brand v-b-hover @click="goHome">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/petitions">Petitions</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="this.$cookies.get('token')" right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item @click="goHome">Profile</b-dropdown-item>
            <b-dropdown-item @click="logout" >Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  export default {
      name: "NavBar",
    props: ['name'],
    data() {
      return {

      }
    },
    mounted: function(){
    },
    computed: {
      loggedIn() {
        if (this.$cookies.get('token')) {
          return true
        } else {
          return false;
        }
      }
    },
    methods: {
      logout: function(){
        let obj = this;
        let authToken = this.$cookies.get('token');
        if (authToken) {
          this.axios.post('http://localhost:4941/api/v1/users/logout', {},{
            headers: {
              'X-Authorization': authToken
            }
          }).then((response) => {
            obj.$cookies.remove('token');
            obj.$cookies.remove('profileId');
            obj.$router.push('/');
          })
        }
      },
      goHome: function() {
        if (this.$cookies.get('token') !== null) {
          this.$router.push('/viewProfile')
        } else {
          this.$router.push('/')
        }
      }

    }
  }
</script>

<style scoped>

</style>
