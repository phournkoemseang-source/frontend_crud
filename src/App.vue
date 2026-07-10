<template>
  <div class="page">
    <header class="header">
      <h1>Product Manager</h1>
      <p class="subtitle">Simple CRUD demo — Vue.js + Node.js + MySQL</p>
    </header>

    <main class="container">
      <!-- Form: Add / Edit -->
      <section class="card form-card">
        <h2>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" type="text" placeholder="Product name" required />
          </div>
          <div class="field">
            <label>Description</label>
            <input v-model="form.description" type="text" placeholder="Short description" />
          </div>
          <div class="row">
            <div class="field">
              <label>Price ($)</label>
              <input v-model.number="form.price" type="number" step="0.01" min="0" required />
            </div>
            <div class="field">
              <label>Quantity</label>
              <input v-model.number="form.quantity" type="number" min="0" required />
            </div>
          </div>
          <div class="actions">
            <button type="submit" class="btn primary">
              {{ isEditing ? 'Update Product' : 'Add Product' }}
            </button>
            <button v-if="isEditing" type="button" class="btn ghost" @click="resetForm">
              Cancel
            </button>
          </div>
        </form>
      </section>

      <!-- Product list -->
      <section class="card">
        <div class="list-header">
          <h2>Products ({{ products.length }})</h2>
          <button class="btn ghost" @click="fetchProducts">Refresh</button>
        </div>

        <p v-if="loading">Loading products...</p>
        <p v-else-if="error" class="error">{{ error }}</p>
        <p v-else-if="products.length === 0">No products yet. Add one above.</p>

        <table v-else class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>{{ p.name }}</td>
              <td class="muted">{{ p.description }}</td>
              <td>${{ Number(p.price).toFixed(2) }}</td>
              <td>{{ p.quantity }}</td>
              <td class="row-actions">
                <button class="btn small" @click="editProduct(p)">Edit</button>
                <button class="btn small danger" @click="removeProduct(p.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script>
import api from './api';

export default {
  name: 'App',
  data() {
    return {
      products: [],
      loading: false,
      error: '',
      isEditing: false,
      editingId: null,
      form: {
        name: '',
        description: '',
        price: 0,
        quantity: 0
      }
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = '';
      try {
        const res = await api.getProducts();
        this.products = res.data;
      } catch (err) {
        this.error = 'Could not load products. Is the backend server running?';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await api.updateProduct(this.editingId, this.form);
        } else {
          await api.createProduct(this.form);
        }
        this.resetForm();
        this.fetchProducts();
      } catch (err) {
        this.error = 'Could not save the product.';
        console.error(err);
      }
    },
    editProduct(product) {
      this.isEditing = true;
      this.editingId = product.id;
      this.form = {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        quantity: product.quantity
      };
    },
    async removeProduct(id) {
      if (!confirm('Delete this product?')) return;
      try {
        await api.deleteProduct(id);
        this.fetchProducts();
      } catch (err) {
        this.error = 'Could not delete the product.';
        console.error(err);
      }
    },
    resetForm() {
      this.isEditing = false;
      this.editingId = null;
      this.form = { name: '', description: '', price: 0, quantity: 0 };
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: #f4f6f8;
  color: #1f2937;
}
.page {
  min-height: 100vh;
}
.header {
  background: #1f6feb;
  color: white;
  padding: 28px 20px;
  text-align: center;
}
.header h1 {
  margin: 0 0 4px;
  font-size: 26px;
}
.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  display: grid;
  gap: 20px;
}
.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.card h2 {
  margin-top: 0;
  font-size: 18px;
}
.field {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.row {
  display: flex;
  gap: 14px;
}
label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}
input {
  padding: 9px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}
input:focus {
  outline: 2px solid #1f6feb;
  outline-offset: 1px;
}
.actions {
  display: flex;
  gap: 10px;
}
.btn {
  border: none;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}
.btn.primary {
  background: #1f6feb;
  color: white;
}
.btn.ghost {
  background: #e5e7eb;
  color: #1f2937;
}
.btn.small {
  padding: 6px 10px;
  font-size: 13px;
  margin-right: 6px;
}
.btn.danger {
  background: #fee2e2;
  color: #b91c1c;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.table th,
.table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}
.muted {
  color: #6b7280;
}
.row-actions {
  white-space: nowrap;
}
.error {
  color: #b91c1c;
}
</style>
