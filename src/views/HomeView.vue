<template>
  <div class="home container">
    <header class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are four total invoices.</span>
      </div>
      <div class="right flex">
        <div class="filter flex" @click="toggleFilterMenu">
          <span>Filter by status</span>
          <img src="../assets/icon-arrow-down.svg" alt="arrowdown" />
          <ul class="filter-menu" v-if="filterMenu">
            <li>Draft</li>
            <li>Pending</li>
            <li>Paid</li>
            <li>Clear</li>
          </ul>
        </div>
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </header>
    <!-- INVOICES -->
    <main>
      <div
        v-if="store.state.invoiceData.length > 0 || store.state.invoicesLoaded"
      >
        <Invoice
          v-for="(invoice, index) in store.state.invoiceData"
          :key="index"
          :invoice="invoice"
        />
      </div>
      <div v-else class="empty flex flex-column">
        <img src="../assets/illustration-empty.svg" alt="" />
        <h3>There is nothing here.</h3>
        <p>Create a new invoice by clicking the New Invoice button</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import Invoice from "../components/Invoice/Invoice.vue";
const store = useStore();

const filterMenu = ref(false);
const newInvoice = () => {
  store.commit("TOGGLE_INVOICE");
};
const toggleFilterMenu = () => {
  filterMenu.value = !filterMenu.value;
};
</script>
<style lang="scss" scoped>
.home {
  color: #fff;
  .header {
    margin-bottom: 65px;
    .left,
    .right {
      flex: 1;
    }
    .right {
      justify-content: flex-end;
      align-items: center;
      .button,
      .filter {
        align-items: center;
        span {
          font-size: 12px;
        }
      }
      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;
        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }
        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;
            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }
      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;
        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }
  .empty {
    margin-top: 160px;
    align-items: center;
    img {
      width: 214px;
      height: 200px;
    }
    h3 {
      font-size: 20px;
      margin-top: 40px;
    }
    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
