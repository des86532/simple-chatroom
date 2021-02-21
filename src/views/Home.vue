<template lang="pug">
  #home
    .chatroom
      .header
        .title-group
          .title(
            v-for="item in typeList"
            :key="item.type"
            :class="{ 'active' : item.type === type}"
            @click="setType(item.type)"
          ) {{ item.name }}
        .name(@click="logout") {{ nickname }}
      .banner
        .text 最近淘寶辦 1111 慶祝，有推薦的店家嗎？
        i.fas.fa-sort-down.arrow
      .main
        component(:is="typeList[type - 1]['component']")
</template>

<script>
import helloworld from '@/components/helloworld.vue';
import personal from '@/components/personal.vue';
import todayNews from '@/components/todayNews.vue';

export default {
  name: 'Home',
  components: {
    helloworld,
    personal,
    todayNews,
  },
  data() {
    return {
      type: 3,
      typeList: [
        {
          type: 1,
          name: '首頁',
          component: 'helloworld',
        },
        {
          type: 2,
          name: '本日話題',
          component: 'todayNews',
        },
        {
          type: 3,
          name: '偷偷說',
          component: 'personal',
        }
      ]
    }
  },
  computed: {
    nickname() {
      return window.sessionStorage.getItem('name');
    }
  },
  methods: {
    setType(type) {
      this.type = type;
    },
    logout() {
      window.sessionStorage.removeItem('name')
      this.$router.push({ name: 'Login' })
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/_variables';

  #home {
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .chatroom {
      width: 80%;
      min-width: 350px;
      height: 600px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;

        .title-group {
          display: flex;
          align-items: center;
        }

        .title {
          padding: 20px;
          position: relative;
          cursor: pointer;

          &.active {
            &:after {
              content: '';
              width: 100%;
              height: 5px;
              background-color: $dark-blue;
              position: absolute;
              left: 0;
              bottom: 0;
            }
          }
        }

        .name {
          padding: 20px;
          background-color: $dark-blue;
          color: white;
          cursor: pointer;
        }
      }

      .banner {
        height: 100px;
        background-color: $soft-pink;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset 0px 15px 10px -15px black;
        letter-spacing: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .text {
          width: 80%;
          text-align: center;
          line-height: 24px;
        }

        .arrow {
          color: white;
          position: absolute;
          right: 20px;
          font-size: 20px;
        }
      }
    }
  }
</style>