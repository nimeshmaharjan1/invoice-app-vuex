<script setup lang="ts">
import { onMounted, ref } from "vue";
import Navigation from "./components/Navigation.vue";
import InvoiceModal from "./components/AddInvoiceModal.vue";
import { useStore } from "vuex";
import Modal from "./components/Modal.vue";
const store = useStore();
let isMobile = ref<boolean>(false);
const checkScreen = () => {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 750) {
    isMobile.value = true;
    console.log("isMobile");
    return;
  }
  console.log("Hello");
  isMobile.value = false;
};
onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
  store.dispatch("GET_INVOICES");
});
</script>
<template>
  <div>
    <div v-if="!isMobile" class="app flex flex-column">
      <Navigation />
      <div class="app-content flex flex-column">
        <Modal v-if="store.state.modalActive" />
        <transition name="invoice-transition">
          <InvoiceModal v-if="store.state.invoiceModal"
        /></transition>
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-message flex flex-column">
      <h2>Sorry, this app is not supported on mobile devices.</h2>
      <p>To use this app, please use a computer or a tablet.</p>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.app {
  min-height: 100vh;
  background-color: #141625 !important;
  @media (min-width: 900px) {
    flex-direction: row !important;
  }
  .app-content {
    position: relative;
    padding: 0 20px;
    flex-direction: column;
    min-width: 90vw;
    h1,
    h2,
    h3,
    h4,
    h5 {
      color: white;
    }
    input {
      padding-left: 0.7rem;
      padding-right: 0.7rem;
    }
  }
}
.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: white;
  h2 {
    color: white;
  }
  p {
    margin-top: 1rem;
  }
}

//animate Invoice Modal
.invoice-transition-enter-active,
.invoice-transition-leave-active {
  transition: 0.8s ease all;
}

.invoice-transition-enter-from,
.invoice-transition-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}
.dark-purple {
  background-color: #252945;
}
.red {
  background-color: #ec5757;
}
.purple {
  background-color: #7c5dfa;
}
.green {
  background-color: #33d69f;
}
.orange {
  background-color: #ff8f00;
}
// utility classes
.flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;
  @media (min-width: 900px) {
    padding-top: 72px;
  }
}
.nav-link {
  text-decoration: none;
  color: initial;
}
// Status Button Styling
.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}
.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}
.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}
.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
