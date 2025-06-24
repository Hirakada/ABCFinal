import { cars } from './car.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('car-container');
    const orderDetail = document.getElementById('order-detail');
    const saveButton = document.getElementById('save-button');
    const customerOrders = document.getElementById('customer-orders');
    const nameInput = document.getElementById('customer-name');

    cars.forEach((car, index) => {
        const card = document.createElement('div');
        card.className = 'card-car';

        const img = document.createElement('img');
        img.src = car.image;
        img.alt = `${car.name} image`;

        const name = document.createElement('p');
        name.className = 'car-name';
        name.textContent = car.name;

        const price = document.createElement('p');
        price.className = 'car-price';
        price.textContent = `Rp ${car.price.toLocaleString('id-ID')} / hari`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'car-checkbox';

        const inputBox = document.createElement('div');
        inputBox.className = 'rental-inputs';
        inputBox.style.display = 'none';

        const today = new Date().toISOString().split('T')[0];

        const startRow = document.createElement('div');
        startRow.className = 'input-row';
        const startLabel = document.createElement('label');
        startLabel.textContent = 'Start:';
        const startInput = document.createElement('input');
        startInput.type = 'date';
        startInput.value = today;
        startInput.min = today;
        startRow.append(startLabel, startInput);

        const durationRow = document.createElement('div');
        durationRow.className = 'input-row';
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Durasi (hari):';
        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.min = 1;
        durationInput.value = 1;
        durationRow.append(durationLabel, durationInput);

        inputBox.append(startRow, durationRow);

        checkbox.addEventListener('change', () => {
            inputBox.style.display = checkbox.checked ? 'flex' : 'none';
        });

        card.append(img, name, price, checkbox, inputBox);
        container.appendChild(card);
    });

    document.getElementById('calculate-button').addEventListener('click', () => {
        const checked = document.querySelectorAll('.car-checkbox:checked');
        if (!nameInput.value.trim()) return alert('Atas nama siapa ya?');
        if (!checked.length) return alert('KOSONG?! Rugi donk!!');

        let total = 0;
        let summary = '';

        checked.forEach(box => {
            const card = box.closest('.card-car');
            const carName = card.querySelector('.car-name').textContent;
            const price = Number(card.querySelector('.car-price').textContent.replace(/\D/g, ''));
            const days = Number(card.querySelector('input[type="number"]').value);
            const startDate = card.querySelector('input[type="date"]').value;
            const subtotal = price * days;

            total += subtotal;
            summary += `• ${carName} - ${startDate} - ${days} hari - Rp ${subtotal.toLocaleString('id-ID')}\n`;
        });

        orderDetail.textContent = `Nama: ${nameInput.value}\n\nMobil Disewa:\n${summary}\nTotal Harga: Rp ${total.toLocaleString('id-ID')}`;
    });

    saveButton.addEventListener('click', () => {
        const checked = document.querySelectorAll('.car-checkbox:checked');
        if (!nameInput.value.trim()) return alert('Atas nama siapa ya?');
        if (!checked.length) return alert('KOSONG?! Rugi donk!!');

        const nama = nameInput.value.trim();
        const time = new Date().toLocaleString('id-ID');
        const items = [];
        let total = 0;

        checked.forEach(box => {
            const card = box.closest('.card-car');
            const carName = card.querySelector('.car-name').textContent;
            const price = Number(card.querySelector('.car-price').textContent.replace(/\D/g, ''));
            const days = Number(card.querySelector('input[type="number"]').value);
            const startDate = card.querySelector('input[type="date"]').value;
            const subtotal = price * days;
            total += subtotal;

            items.push({
                namaMobil: carName,
                tanggal: startDate,
                durasi: days,
                hargaPerHari: price,
                subtotal: subtotal
            });
        });

        const newOrder = {
            namaPelanggan: nama,
            waktuPemesanan: time,
            mobil: items,
            totalHarga: total
        };
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(newOrder);
        console.log('Pesanan ditambahkan:', newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
        resetForm();
    });

    function resetForm() {
        document.querySelectorAll('.car-checkbox').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change'));
        });

        document.querySelectorAll('.rental-inputs').forEach(inputBox => {
            const dateInput = inputBox.querySelector('input[type="date"]');
            const numberInput = inputBox.querySelector('input[type="number"]');
            const today = new Date().toISOString().split('T')[0];
            if (dateInput) dateInput.value = today;
            if (numberInput) numberInput.value = 1;
        });

        nameInput.value = '';
        orderDetail.textContent = '';
    }

    function renderOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        customerOrders.innerHTML = '';

        orders.forEach((order, index) => {
            const box = document.createElement('div');
            box.className = 'order-box';

            const title = document.createElement('h4');
            title.textContent = `${order.namaPelanggan} – ${order.waktuPemesanan}`;

            const ul = document.createElement('ul');
            order.mobil.forEach(m => {
                const li = document.createElement('li');
                li.textContent = `${m.namaMobil} – ${m.tanggal} – ${m.durasi} hari – Rp ${m.subtotal.toLocaleString('id-ID')}`;
                ul.appendChild(li);
            });

            const total = document.createElement('p');
            total.innerHTML = `<strong>Total:</strong> Rp ${order.totalHarga.toLocaleString('id-ID')}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.className = 'delete-button';
            deleteBtn.addEventListener('click', () => {
                console.log('Pesanan terhapus:', orders[index]);
                orders.splice(index, 1);
                localStorage.setItem('orders', JSON.stringify(orders));
                renderOrders();
            });

            box.append(title, ul, total, deleteBtn);
            customerOrders.appendChild(box);
        });
    }

    renderOrders();
});
