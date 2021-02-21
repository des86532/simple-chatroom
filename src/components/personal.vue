<template lang="pug">
  #personal
    .loading(v-if="loading") loading...
    .content(ref="content" @click="showImage = false")
      .role(v-for="(item, index) in dataList" :key="index" :class="{ 'self' : item.name === nickname }")
        .name(:style="`color: ${getColor(item.name)}`") {{ item.name }}
        template(v-if="item.type === 'image'")
          img(:src="item.content", alt="alt" width="100px" height="100px")
        template(v-else)
          .say(:style="`border: 1px solid ${getColor(item.name)}`") {{ item.content }}
    .tool-wrapper(:class="{ 'showImage' : showImage }")
      .tool
        .send-image(@click="removeAll")
          i.far.fa-image
        .send-emoji(@click="showImage = !showImage")
          i.far.fa-smile
        input.send-input(type="text" v-model.trim="postData.content" @keyup.enter="submit")
        .send-message(@click="submit")
          i.far.fa-paper-plane
      .image-wrapper(v-show="showImage")
        .image(v-for="(item, index) in imageUrl" :key="index" @click="submitImage(item)")
          img(:src="item" width="150px" height="150px")
</template>

<script>
export default {
  data() {
    return {
      dataList: {},
      postData: {
        type: 'text',
        name: window.sessionStorage.getItem('name'),
        content: '',
      },
      showImage: false,
      nameList: {},
      colorIndex: 0,
      colorList: [
        '#6d6e70',
        '#56a0d3',
        '#49c0b6',
        '#ff6a00',
        '#ce181e',
      ],
      imageList: [
        'nurse.jpg',
        'boom.jpg',
        'sad.jpg',
      ],
      imageUrl: [],
      loading: true,
    }
  },
  computed: {
    nickname() {
      return window.sessionStorage.getItem('name');
    },
  },
  methods: {
    getColor(name) {
      if (name === this.nickname) return;
      return this.colorList[this.nameList[name]['value']]
    },
    scrollToBottom() {
      const height = this.$refs.content.scrollHeight;
      this.$refs.content.scrollTo(0, height);
    },
    removeAll() {
      const vm = this;
      this.$database.ref().remove().then(() => {
        vm.dataList = {};
        vm.nameList = {};
        vm.colorIndex = 0;
      })
    },
    watchMsg() {
      const vm = this;
      this.$database.ref().limitToLast(1).on('value', function(snapshot) {

        if (snapshot.val() === null) return;

        if (!vm.nameList[Object.values(snapshot.val())[0]['name']]) {
          vm.nameList[Object.values(snapshot.val())[0]['name']] = { value: Object.values(snapshot.val())[0]['name'] === vm.nickname ? -1 : vm.colorIndex }
          if (Object.values(snapshot.val())[0]['name'] !== vm.nickname) {
            vm.colorIndex = (vm.colorIndex + 1) % vm.colorList.length;
          }
        }

        vm.dataList = Object.assign({}, vm.dataList, snapshot.val())
      });
    },
    submitImage(url) {
      const postData = {
        type: 'image',
        content: url,
        name: window.sessionStorage.getItem('name'),
      }
      this.$database.ref().push(postData);
      this.showImage = false;
      this.$nextTick(() => {
        this.scrollToBottom();
      })
    },
    submit() {
      if (this.postData.content.length <= 0 ) return
      this.$database.ref().push(this.postData);
      this.postData.content = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      })
    },
    getImage() {
      const vm = this;
      const storageRef = this.$storage.ref();
      const imagesRef = storageRef.child('images');
      this.imageList.forEach((item) => {
        imagesRef.child(item).getDownloadURL().then((url) => {
          vm.imageUrl.push(url);
        })
      });
    },
    getData() {
      return new Promise((resolve, reject) => {
        const vm = this;

        this.$database.ref().once('value', function(snapshot) {
          if (snapshot.val() === null) reject();

          for (let i in snapshot.val()) {
            if (!Object.keys(vm.nameList).includes(snapshot.val()[i]['name'])) {
              vm.nameList[snapshot.val()[i]['name']] = { value: snapshot.val()[i]['name'] === vm.nickname ? -1 : vm.colorIndex }
              if (snapshot.val()[i]['name'] !== vm.nickname) {
                vm.colorIndex = (vm.colorIndex + 1) % vm.colorList.length;
              }
            }
          }

          vm.dataList = Object.assign({}, snapshot.val())
          return resolve();
        });
      })
    },
  },
  async mounted() {
    this.getImage();
    await this.getData().then((res) => {
      this.scrollToBottom();
    }).catch(() => {})
    this.watchMsg();
    this.loading = false;
  },
}
</script>

<style lang="scss">
@import '../assets/scss/_variables';

  #personal {
    position: relative;

    .loading {
      position: fixed;
      left: 0;
      top: 0;
      background-color: rgba(0,0,0, 0.5);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      z-index: 1;
    }

    .content {
      padding: 20px 20px 60px;
      background-color: white;
      height: 500px;
      overflow: auto;
      transition: scroll 1.5s linear;
      scroll-behavior: smooth;

      .role {
        margin-bottom: 10px;

        .name {
          margin-bottom: 10px;
        }

        .say {
          padding: 16px;
          border-radius: 0 16px 16px 16px;
          display: inline-flex;
          word-break: break-all;
        }

        &.self {
          text-align: right;

          .name {
            color: $dark-blue;
          }

          .say {
            background-color: $dark-blue;
            color: white;
            border: none;
            border-radius: 16px 0 16px 16px;
          }
        }
      }
    }

    .tool-wrapper {
      transition: height .5s ease-in;
      filter: drop-shadow(0px -1px 3px rgba(0,0,0,0.2));
      padding: 15px 0;
      background-color: white;
      width: 100%;
      height: 60px;
      position: absolute;
      bottom: 0;
      overflow: hidden;

      &.showImage {
        height: 250px;
      }
    }

    .tool {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .send-input {
        border: 1px solid black;
        border-radius: 12px;
        margin: 0 10px;
        padding: 5px 10px;
        outline: none;
        flex: 1;

        &:focus {
          box-shadow: 0px 0px 4px 0px blue;
        }
      }
    }

    .tool > div{
      padding: 0 15px;
      cursor: pointer;
    }

    .image-wrapper {
      display: flex;
      margin: 0 20px;
      overflow: auto;

      .image {
        margin-right: 15px;
      }
    }
  }
</style>