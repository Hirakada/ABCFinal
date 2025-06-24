import { cars } from './car.js';

document.addEventListener('DOMContentLoaded', () => {
    const carContainer = document.getElementById('car-container');
    const orderDetail = document.getElementById('order-detail');
    const saveButton = document.getElementById('save-button');
    const calculateButton = document.getElementById('calculate-button');
    const customerOrders = document.getElementById('customer-orders');
    const customerName = document.getElementById('customer-name');

    cars.forEach((carData) => {
        const carCard = document.createElement('div');
        carCard.className = 'card-car';

        const carImage = document.createElement('img');
        carImage.src = carData.image;
        carImage.alt = `${carData.name} image`;

        const carName = document.createElement('p');
        carName.className = 'car-name';
        carName.textContent = carData.name;

        const carPrice = document.createElement('p');
        carPrice.className = 'car-price';
        carPrice.textContent = `Rp ${carData.price.toLocaleString('id-ID')} / hari`;

        const carCheckbox = document.createElement('input');
        carCheckbox.type = 'checkbox';
        carCheckbox.className = 'car-checkbox';
        carCheckbox.dataset.name = carData.name;
        carCheckbox.dataset.price = carData.price;

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'rental-inputs';
        inputWrapper.style.display = 'none';

        const today = new Date().toISOString().split('T')[0];

        const startRow = document.createElement('div');
        startRow.className = 'input-row';
        const startLabel = document.createElement('label');
        startLabel.textContent = 'Start:';
        const startDate = document.createElement('input');
        startDate.type = 'date';
        startDate.value = today;
        startDate.min = today;
        startDate.className = 'start-date';
        startRow.append(startLabel, startDate);

        const durationRow = document.createElement('div');
        durationRow.className = 'input-row';
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Durasi (hari):';
        const duration = document.createElement('input');
        duration.type = 'number';
        duration.min = 1;
        duration.value = 1;
        duration.className = 'duration';
        durationRow.append(durationLabel, duration);

        inputWrapper.append(startRow, durationRow);

        carCheckbox.addEventListener('change', () => {
            inputWrapper.style.display = carCheckbox.checked ? 'flex' : 'none';
        });

        carCard.append(carImage, carName, carPrice, carCheckbox, inputWrapper);
        carContainer.appendChild(carCard);
    });

    calculateButton.addEventListener('click', () => {
        const checkedBoxes = document.querySelectorAll('.car-checkbox:checked');
        if (!customerName.value.trim()) return alert('Atas nama siapa ya?');
        if (!checkedBoxes.length) return alert('KOSONG?! Rugi dong!!');

        let total = 0;
        let summary = '';

        checkedBoxes.forEach((checkbox) => {
            const card = checkbox.closest('.card-car');
            const name = checkbox.dataset.name;
            const price = Number(checkbox.dataset.price);
            const start = card.querySelector('.start-date').value;
            const days = Number(card.querySelector('.duration').value);
            const subtotal = price * days;

            total += subtotal;
            summary += `• ${name} - ${start} - ${days} hari - Rp ${subtotal.toLocaleString('id-ID')}\n`;
        });

        orderDetail.textContent = `Nama: ${customerName.value}\n\nMobil Disewa:\n${summary}\nTotal Harga: Rp ${total.toLocaleString('id-ID')}`;
    });

    saveButton.addEventListener('click', () => {
        const checkedBoxes = document.querySelectorAll('.car-checkbox:checked');
        if (!customerName.value.trim()) return alert('Atas nama siapa ya?');
        if (!checkedBoxes.length) return alert('KOSONG?! Rugi donk!!');

        const name = customerName.value.trim();
        const timestamp = new Date().toLocaleString('id-ID');
        const rentedCars = [];
        let total = 0;

        checkedBoxes.forEach((checkbox) => {
            const card = checkbox.closest('.card-car');
            const name = checkbox.dataset.name;
            const price = Number(checkbox.dataset.price);
            const start = card.querySelector('.start-date').value;
            const days = Number(card.querySelector('.duration').value);
            const subtotal = price * days;

            total += subtotal;

            rentedCars.push({
                namaMobil: name,
                tanggal: start,
                durasi: days,
                hargaPerHari: price,
                subtotal: subtotal
            });
        });

        const newOrder = {
            namaPelanggan: name,
            waktuPemesanan: timestamp,
            mobil: rentedCars,
            totalHarga: total
        };

        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        allOrders.push(newOrder);
        console.log('Pesanan ditambahkan:', newOrder);
        localStorage.setItem('orders', JSON.stringify(allOrders));

        updateOrders();
        resetForm();
    });

    function resetForm() {
        document.querySelectorAll('.car-checkbox').forEach((checkbox) => {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        });

        document.querySelectorAll('.start-date').forEach((input) => {
            input.value = new Date().toISOString().split('T')[0];
        });

        document.querySelectorAll('.duration').forEach((input) => {
            input.value = 1;
        });

        customerName.value = '';
        orderDetail.textContent = '';
    }

    function updateOrders() {
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        customerOrders.innerHTML = '';

        allOrders.forEach((order, index) => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-box';

            const title = document.createElement('h4');
            title.textContent = `${order.namaPelanggan} – ${order.waktuPemesanan}`;

            const orderList = document.createElement('ul');
            order.mobil.forEach((car) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${car.namaMobil} – ${car.tanggal} – ${car.durasi} hari – Rp ${car.subtotal.toLocaleString('id-ID')}`;
                orderList.appendChild(listItem);
            });

            const totalText = document.createElement('p');
            totalText.innerHTML = `<strong>Total:</strong> Rp ${order.totalHarga.toLocaleString('id-ID')}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Hapus';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                console.log('Pesanan terhapus:', allOrders[index]);
                allOrders.splice(index, 1);
                localStorage.setItem('orders', JSON.stringify(allOrders));
                updateOrders();
            });

            orderCard.append(title, orderList, totalText, deleteButton);
            customerOrders.appendChild(orderCard);
        });
    }

    updateOrders();
});
