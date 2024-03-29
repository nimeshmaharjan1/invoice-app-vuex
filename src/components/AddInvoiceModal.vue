<script setup>
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { uid } from "uid";
import db from "../firebase/firebaseInit";
import Loading from "./Loading.vue";
import { useRoute } from "vue-router";
const route = useRoute();
// export interface InvoiceModal {
//   dateOptions: Object;
//   billerStreetAddress?: string;
//   billerCity?: string;
//   billerZipCode?: string;
//   billerCountry?: string;
//   clientName?: string;
//   clientEmail?: string;
//   clientStreetAddress?: string;
//   clientCity?: string;
//   clientZipCode?: string;
//   clientCountry?: string;
//   invoiceDateUnix?: any;
//   invoiceDate?: string;
//   paymentTerms?: any;
//   paymentDueDateUnix?: any;
//   paymentDueDate?: any;
//   productDescription?: string;
//   invoicePending?: any;
//   invoiceDraft?: any;
//   invoiceItemList?: any;
//   invoiceTotal?: number;
// }
// export interface InvoiceItem {
//   id: string;
//   itemName: string;
//   qty: string;
//   price: number;
//   total: number;
// }
const invoiceModal = ref({
  dateOptions: { year: "numeric", month: "short", day: "numeric" },
  docId: null,
  loading: null,
  billerStreetAddress: "",
  billerCity: "",
  billerZipCode: "",
  billerCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreetAddress: "",
  clientCity: "",
  clientZipCode: "",
  clientCountry: "",
  invoiceDateUnix: null,
  invoiceDate: "",
  paymentTerms: "",
  paymentDueDateUnix: "",
  paymentDueDate: "",
  productDescription: "",
  invoicePending: null,
  invoiceDraft: null,
  invoiceItemList: [],
  invoiceTotal: 0,
});
const store = useStore();
const closeInvoice = () => {
  store.commit("TOGGLE_INVOICE");
  if (store.state.editInvoice) {
    store.commit("TOGGLE_EDIT_INVOICE");
  }
};
onMounted(() => {
  if (!store.state.editInvoice) {
    invoiceModal.value.invoiceDateUnix = Date.now();
    invoiceModal.value.invoiceDate = new Date(
      invoiceModal.value.invoiceDateUnix,
    ).toLocaleDateString("en-us", invoiceModal.value.dateOptions);
  }
  if (store.state.editInvoice) {
    const currentInvoice = store.state.currentInvoiceArray[0];
    invoiceModal.value.docId = currentInvoice.docId;
    invoiceModal.value.billerStreetAddress = currentInvoice.billerStreetAddress;
    invoiceModal.value.billerCity = currentInvoice.billerCity;
    invoiceModal.value.billerZipCode = currentInvoice.billerZipCode;
    invoiceModal.value.billerCountry = currentInvoice.billerCountry;
    invoiceModal.value.clientName = currentInvoice.clientName;
    invoiceModal.value.clientEmail = currentInvoice.clientEmail;
    invoiceModal.value.clientStreetAddress = currentInvoice.clientStreetAddress;
    invoiceModal.value.clientCity = currentInvoice.clientCity;
    invoiceModal.value.clientZipCode = currentInvoice.clientZipCode;
    invoiceModal.value.clientCountry = currentInvoice.clientCountry;
    invoiceModal.value.invoiceDateUnix = currentInvoice.invoiceDateUnix;
    invoiceModal.value.invoiceDate = currentInvoice.invoiceDate;
    invoiceModal.value.paymentTerms = currentInvoice.paymentTerms;
    invoiceModal.value.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
    invoiceModal.value.paymentDueDate = currentInvoice.paymentDueDate;
    invoiceModal.value.productDescription = currentInvoice.productDescription;
    invoiceModal.value.invoicePending = currentInvoice.invoicePending;
    invoiceModal.value.invoiceDraft = currentInvoice.invoiceDraft;
    invoiceModal.value.invoiceItemList = currentInvoice.invoiceItemList;
    invoiceModal.value.invoiceTotal = currentInvoice.invoiceTotal;
  }
});
watch(
  () => invoiceModal.value.paymentTerms,
  () => {
    const futureDate = new Date();
    invoiceModal.value.paymentDueDateUnix = futureDate.setDate(
      futureDate.getDate() + parseInt(invoiceModal.value.paymentTerms),
    );
    invoiceModal.value.paymentDueDate = new Date(
      invoiceModal.value.paymentDueDateUnix,
    ).toLocaleDateString("en-us", invoiceModal.value.dateOptions);
  },
);
const addNewInvoiceItem = () => {
  invoiceModal.value.invoiceItemList?.push({
    id: uid(),
    itemName: "",
    qty: "",
    price: 0,
    total: 0,
  });
};
const deleteInvoiceItem = (id) => {
  const filteredArr = invoiceModal.value.invoiceItemList.filter(
    (item) => item.id === id,
  );
  invoiceModal.value.invoiceItemList = filteredArr;
};
const publishInvoice = () => {
  invoiceModal.value.invoicePending = true;
};
const saveDraft = () => {
  invoiceModal.value.invoiceDraft = true;
};
const calculateInvoiceTotal = () => {
  invoiceModal.value.invoiceTotal = 0;
  invoiceModal.value.invoiceItemList.forEach((item) => {
    invoiceModal.value.invoiceTotal += item.total;
  });
};
const uploadInvoice = async () => {
  if (invoiceModal.value.invoiceItemList.length <= 0) {
    alert("Please fill the form before submitting.");
    return;
  }
  invoiceModal.value.loading = true;
  calculateInvoiceTotal();
  const database = db.collection("invoices").doc();
  await database.set({
    invoiceId: uid(6),
    billerStreetAddress: invoiceModal.value.billerStreetAddress,
    billerCity: invoiceModal.value.billerCity,
    billerZipCode: invoiceModal.value.billerZipCode,
    billerCountry: invoiceModal.value.billerCountry,
    clientName: invoiceModal.value.clientName,
    clientEmail: invoiceModal.value.clientEmail,
    clientStreetAddress: invoiceModal.value.clientStreetAddress,
    clientCity: invoiceModal.value.clientCity,
    clientZipCode: invoiceModal.value.clientZipCode,
    clientCountry: invoiceModal.value.clientCountry,
    invoiceDateUnix: invoiceModal.value.invoiceDateUnix,
    invoiceDate: invoiceModal.value.invoiceDate,
    paymentTerms: invoiceModal.value.paymentTerms,
    paymentDueDateUnix: invoiceModal.value.paymentDueDateUnix,
    paymentDueDate: invoiceModal.value.paymentDueDate,
    productDescription: invoiceModal.value.productDescription,
    invoicePending: invoiceModal.value.invoicePending,
    invoiceDraft: invoiceModal.value.invoiceDraft,
    invoiceItemList: invoiceModal.value.invoiceItemList,
    invoiceTotal: invoiceModal.value.invoiceTotal,
  });
  invoiceModal.value.loading = false;
  store.commit("TOGGLE_INVOICE");
};
const updateInvoice = async () => {
  if (invoiceModal.value.invoiceItemList.length <= 0) {
    alert("Please fill the form before submitting.");
    return;
  }
  invoiceModal.value.loading = true;
  calculateInvoiceTotal();
  const database = db.collection("invoices").doc(invoiceModal.value.docId);
  await database.update({
    billerStreetAddress: invoiceModal.value.billerStreetAddress,
    billerCity: invoiceModal.value.billerCity,
    billerZipCode: invoiceModal.value.billerZipCode,
    billerCountry: invoiceModal.value.billerCountry,
    clientName: invoiceModal.value.clientName,
    clientEmail: invoiceModal.value.clientEmail,
    clientStreetAddress: invoiceModal.value.clientStreetAddress,
    clientCity: invoiceModal.value.clientCity,
    clientZipCode: invoiceModal.value.clientZipCode,
    clientCountry: invoiceModal.value.clientCountry,
    paymentTerms: invoiceModal.value.paymentTerms,
    paymentDueDate: invoiceModal.value.paymentDueDate,
    paymentDueDateUnix: invoiceModal.value.paymentDueDateUnix,
    productDescription: invoiceModal.value.productDescription,
    invoiceItemList: invoiceModal.value.invoiceItemList,
    invoiceTotal: invoiceModal.value.invoiceTotal,
  });
  invoiceModal.value.loading = false;
  const data = {
    docId: invoiceModal.value.docId,
    routeId: route.params.invoiceId,
  };
  store.dispatch("UPDATE_INVOICE", data);
};
const submitForm = () => {
  if (store.state.editInvoice) {
    updateInvoice();
    return;
  }
  uploadInvoice();
};
const invoiceWrap = ref(null);
function checkClick(e) {
  if (e.target === invoiceWrap.value) {
    store.commit("TOGGLE_MODAL");
  }
}
</script>
<template>
  <div
    ref="invoiceWrap"
    @click="checkClick($event)"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <Loading v-show="invoiceModal.loading" />
      <h1 v-if="!store.state.editInvoice">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>
      <div class="bill-form flex flex-column">
        <h4>Bill Form</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input
            type="text"
            required
            id="billerStreetAddress"
            v-model="invoiceModal.billerStreetAddress"
          />
        </div>
        <div class="location-details flex" style="gap: 1.5rem">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input
              type="text"
              required
              id="billerCity"
              v-model="invoiceModal.billerCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              type="text"
              required
              id="billerZipCode"
              v-model="invoiceModal.billerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              type="text"
              required
              id="billerCountry"
              v-model="invoiceModal.billerCountry"
            />
          </div>
        </div>
      </div>
      <!-- --------------------------------- -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input
            type="text"
            required
            id="clientName"
            v-model="invoiceModal.clientName"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input
            type="text"
            required
            id="clientEmail"
            v-model="invoiceModal.clientEmail"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Client's Street Address</label>
          <input
            type="text"
            required
            id="clientStreetAddress"
            v-model="invoiceModal.clientStreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input
              type="text"
              required
              id="clientCity"
              v-model="invoiceModal.clientCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              type="text"
              required
              id="clientZipCode"
              v-model="invoiceModal.clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              type="text"
              required
              id="clientCountry"
              v-model="invoiceModal.clientCountry"
            />
          </div>
        </div>
      </div>
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input
              type="text"
              disabled
              required
              id="invoiceDate"
              v-model="invoiceModal.invoiceDate"
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input
              type="text"
              disabled
              required
              id="paymentDueDate"
              v-model="invoiceModal.paymentDueDate"
            />
          </div>
        </div>

        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select
            required
            id="paymentTerms"
            v-model="invoiceModal.paymentTerms"
          >
            <option value="30">Net 30 days</option>
            <option value="60">Net 60 days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            type="text"
            required
            id="productDescription"
            v-model="invoiceModal.productDescription"
          />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr
              v-for="(item, index) in invoiceModal.invoiceItemList"
              :key="index"
              class="table-items flex"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">
                ${{ (item.total = item.qty * item.price) }}
              </td>
              <img
                src="../assets/icon-delete.svg"
                alt="delete"
                @click="deleteInvoiceItem(item.id)"
              />
            </tr>
          </table>
          <div class="flex button" @click="addNewInvoiceItem">
            <img src="../assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>
      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!store.state.editInvoice"
            type="submit"
            @click="saveDraft"
            class="dark-purple"
          >
            Save Draft
          </button>
          <button
            v-if="!store.state.editInvoice"
            type="submit"
            @click="publishInvoice"
            class="purple"
          >
            Create Invoice
          </button>
          <button v-if="store.state.editInvoice" class="purple" type="submit">
            Update Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }
  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }
    // Invoice Work
    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }
      .work-items {
        .item-list {
          width: 100%;
          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;
            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 15%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }
          .table-heading {
            margin-bottom: 16px;
            th {
              text-align: left;
            }
          }
          .table-items {
            position: relative;
            margin-bottom: 24px;
            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }
        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;
          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;
      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>
