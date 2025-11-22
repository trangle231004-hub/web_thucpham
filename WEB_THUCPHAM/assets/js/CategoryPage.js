// Sample product data - bạn có thể thay thế bằng API call
const productData = {
    'hang-kho': [
        { name: 'Mơ khô', price: 85000, image: './assets/images/List_Image_HK/MoKho.png', description: 'Mơ khô cao cấp, nguyên chất 100%, không chất bảo quản. Vị chua nhẹ cân bằng, thịt mơ mềm mại, giàu vitamin A và chất xơ. Tốt cho tiêu hóa và sức khỏe tim mạch.' },
        { name: 'Nho khô', price: 102000, image: './assets/images/List_Image_HK/NhoKho.png', description: 'Nho khô tươi, hạt mọng, ngọt tự nhiên không đường bổ sung. Giàu chất chống oxy hóa, kali và sắt. Ăn trực tiếp hoặc dùng để nấu bánh, cơm.' },
        { name: 'Rau củ sấy khô', price: 50000, image: './assets/images/List_Image_HK/RauCuSayKho.png', description: 'Rau củ sấy khô tự nhiên, không hóa chất, giàu vitamin và chất xơ. Dễ bảo quản, tiện lợi sử dụng. Phù hợp nấu canh, xào hoặc ăn trực tiếp.' },
        { name: 'Hạt điều rang', price: 120000, image: './assets/images/List_Image_HK/HatDieuRang.png', description: 'Hạt điều rang chứa chất béo lành, protein cao, năng lượng dàng. Giàu canxi và magne tốt cho xương. Ăn vặt hoặc thêm vào salad, cơm.' },
        { name: 'Hạnh nhân rang', price: 95000, image: './assets/images/List_Image_HK/HanhNhanRang.png', description: 'Hạnh nhân rang thơm, giòn, giàu vitamin E và chất chống oxy hóa. Tốt cho làn da và nội tiết tố. Ăn vặt hoặc làm sữa hạnh nhân.' },
        { name: 'Dưa hấu khô', price: 75000, image: './assets/images/List_Image_HK/DuaHauKho.png', description: 'Dưa hấu khô giòn, vị ngọt ngon. Giàu vitamin C, dễ bảo quản lâu. Ăn vặt hoặc thêm vào các loại hạt khô.' },
        { name: 'Cà chua sấy', price: 65000, image: './assets/images/List_Image_HK/CaChuaSay.png', description: 'Cà chua sấy đỏ thắm, vị đậm đà, giàu lycopene. Tốt cho tim mạch, ít calo. Dùng nấu canh, xào hoặc ăn trực tiếp.' },
        { name: 'Khoai lang sấy', price: 55000, image: './assets/images/List_Image_HK/KhoaiLangSay.png', description: 'Khoai lang sấy vàng ươm, vị ngọt tự nhiên, giàu beta-carotene. An toàn vệ sinh, không hóa chất. Ăn vặt hoặc nấu cơm, cháo.' },
        { name: 'Mít sấy', price: 85000, image: './assets/images/List_Image_HK/MitSay.png', description: 'Mít sấy chứa vitamin C, kali và chất xơ. Vị ngọt ngon, dễ bảo quản. Ăn vặt hoặc thêm vào các mon tráng miệng.' },
        { name: 'Nấm khô', price: 110000, image: './assets/images/List_Image_HK/NamKho.png', description: 'Nấm khô chất lượng cao, giàu protein thực vật, vitamin D. Tốt cho xương và miễn dịch. Ngâm nước rồi nấu canh, xào hoặc kho.' },
        { name: 'Gạo séng cù Lào Cai', price: 53000, image: './assets/images/List_Image_HK/GaoSengCuLaoCai.png', description: 'Gạo séng cù Lào Cai nguyên chất, hạt trắng tinh, nấu mềm ngon. Không bơm phèn, không chất hóa học. Bảo quản lâu, chất lượng tốt.' },
    ],
    'hai-san': [
        { name: 'Tôm hùm', price: 450000, image: './assets/images/List_Image_HSVM/TomHum.png', description: 'Tôm hùm tươi sống, thịt chắc, hương vị tự nhiên đậm đà. Giàu protein và khoáng chất, thích hợp nướng hay hấp.' },
        { name: 'Cá rói chiên sơ', price: 184000, image: './assets/images/List_Image_HSVM/CaRoiChienSo.png', description: 'Cá rói chiên sơ vàng giòn, giữ vị ngọt tự nhiên. Phù hợp làm món ăn nhanh, nhiều protein.' },
        { name: 'Tôm rừng hấp', price: 498000, image: './assets/images/List_Image_HSVM/TomRungHap.png', description: 'Tôm rừng hấp giữ hương vị biển, thịt dày, ngọt tự nhiên. Dùng cho bữa tiệc hoặc món chính.' },
        { name: 'Mực tươi', price: 320000, image: './assets/images/List_Image_HSVM/MucTuoi.png', description: 'Mực tươi, thịt béo, dẻo, phù hợp xào hay nướng. Nguồn protein tốt, nhiều khoáng chất.' },
        { name: 'Cá hồi fillet', price: 824000, image: './assets/images/List_Image_HSVM/CaHoiPillet.png', description: 'Cá hồi fillet nhập khẩu, giàu omega-3, thịt mềm, phù hợp nướng hay sashimi.' },
        { name: 'Cua hoàng đế', price: 650000, image: './assets/images/List_Image_HSVM/CuaHoangDe.png', description: 'Cua hoàng đế tươi, thịt chắc, vị đậm, thích hợp hấp để giữ trọn hương vị biển.' },
        { name: 'Nghêu tươi', price: 250000, image: './assets/images/List_Image_HSVM/NgheuTuoi.png', description: 'Nghêu tươi, nước ngọt, phù hợp nấu canh hoặc xào tỏi. Nguồn khoáng chất và sắt tốt.' },
        { name: 'Sò lớn', price: 180000, image: './assets/images/List_Image_HSVM/SoLon.png', description: 'Sò lớn tươi, thịt mọng, thích hợp nướng mỡ hành. Giàu protein và vi chất cần thiết.' },
        { name: 'Cá bớp tươi', price: 280000, image: './assets/images/List_Image_HSVM/CaBuopTuoi.png', description: 'Cá bớp tươi, thịt chắc, phù hợp nướng hay kho. Dinh dưỡng cao, ít xương.' },
        { name: 'Cua xanh tươi', price: 380000, image: './assets/images/List_Image_HSVM/CuaXanhTuoi.png', description: 'Cua xanh tươi, thịt thơm, giàu canxi. Hấp hoặc nấu cháo đều ngon.' },
        { name: 'Cá hồi fillet Nauy', price: 280000, image: './assets/images/List_Image_HSVM/CaHoiPilletNaUy.png', description: 'Cá hồi fillet Nauy nhập khẩu, thịt cam, giàu omega-3. Chống viêm, tốt cho tim mạch. Nướng, xào hoặc hấp.' },
        { name: 'Cá đầm lúa Thanh Lãng', price: 120000, image: './assets/images/List_Image_HSVM/CaDamLuaThanhLang.png', description: 'Cá đầm lúa Thanh Lãng tươi, thịt ngọt mềm. Bổ khí huyết, dễ tiêu hóa. Nấu canh chua hay kho thơm.' }
    ],
    'rau-cu': [
            { name: 'Đậu phụ bìa', price: 6000, image: './assets/images/List_Image_RCHC/DauPhuBia.png', description: 'Đậu phụ bìa tươi mềm, ngon tuyệt. Làm từ hạt đậu tương chọn lọc, không gia cố chắc. Giàu protein, an toàn vệ sinh.' },
        { name: 'Rau cải xanh', price: 25000, image: './assets/images/List_Image_RCHC/RauCaiXanh.png', description: 'Rau cải xanh tươi, giòn, theo tiêu chuẩn an toàn. Giàu vitamin A, C, K và chất xơ. Xào hay nấu canh ngon.' },
        { name: 'Cà chua tươi', price: 35000, image: './assets/images/List_Image_RCHC/CaChuaTuoi.png', description: 'Cà chua tươi, ngọt chua cân bằng, giàu lycopene. Ăn sống hay nấu súp tốt cho sức khỏe.' },
        { name: 'Bắp cải', price: 52000, image: './assets/images/List_Image_RCHC/BapCai.png', description: 'Bắp cải giòn, nhiều vitamin U tốt cho dạ dày. Làm salad hay xào đều ngon.' },
        { name: 'Quả su su', price: 52000, image: './assets/images/List_Image_RCHC/QuaSuSu.png', description: 'Su su tươi, thịt mềm, ít calo, giàu chất xơ. Nấu canh hay xào đều thích hợp.' },
        { name: 'Dưa chuột', price: 28000, image: './assets/images/List_Image_RCHC/DuaChuot.png', description: 'Dưa chuột giòn mát, ít calo, phù hợp ăn sống hay làm đồ chua tốt.' },
        { name: 'Ớt chuông', price: 42000, image: './assets/images/List_Image_RCHC/OtChuong.png', description: 'Ớt chuông giòn, vị ngọt, giàu vitamin C. Ăn sống hay xào tùy ý.' },
        { name: 'Rau muống', price: 18000, image: './assets/images/List_Image_RCHC/RauMuong.png', description: 'Rau muống tươi, xanh, giàu vitamin và khoáng chất. Xào tỏi hay nấu canh rất phổ biến.' },
        { name: 'Cải thìa', price: 22000, image: './assets/images/List_Image_RCHC/CaiThia.png', description: 'Cải thìa tươi, lá mềm, giàu vitamin K. Hấp hay xào nhẹ giữ độ ngọt.' },
        { name: 'Bông cải xanh', price: 48000, image: './assets/images/List_Image_RCHC/BongCaiXanh.png', description: 'Bông cải xanh giàu chất chống oxy hóa, vitamin C. Hấp hay xào tốt cho sức khỏe.' },
        { name: 'Khoai lang', price: 30000, image: './assets/images/List_Image_RCHC/KhoaiLang.png', description: 'Khoai lang tươi, giàu beta-carotene và chất xơ. Nướng hay luộc làm món ăn vặt bổ dưỡng.' },
        { name: 'Cải ngồng RH', price: 23000, image: './assets/images/List_Image_RCHC/CaiNgongRH.png', description: 'Cải ngồng tươi xanh, giàu calcium và vitamin K. Xào nhẹ hoặc hấp giữ độ giòn mát.' },
        { name: 'Rau thơm tổng hợp RB', price: 70000, image: './assets/images/List_Image_RCHC/RauThomTongHopRB.png', description: 'Rau thơm tổng hợp gồm rau thơm các loại, giàu chất dinh dưỡng. Trang trí hoặc nấu canh ngon.' },
        { name: 'Thì là RB', price: 395000, image: './assets/images/List_Image_RCHC/ThiLaRB.png', description: 'Thì là RB quý hiếm, giàu dinh dưỡng, vị ngon đặc biệt. Nấu canh hay hầm với gà. Tốt cho sức khỏe và miễn dịch.' }
    ],
    'thit-ca': [
        { name: 'Bánh ram Hà Tĩnh', price: 45000, image: './assets/images/List_Image_TCDD/BanhRam.png', description: 'Bánh ram truyền thống Hà Tĩnh, giòn rụm, thơm lừng. Làm từ nguyên liệu tươi sạch, không hóa chất. Ăn kèm cơm hay các món khác.' },
        { name: 'Thịt gà tươi', price: 95000, image: './assets/images/List_Image_TCDD/ThitGaTuoi.png', description: 'Thịt gà tươi sạch, nuôi thả an toàn. Giàu protein, phù hợp các món xào, luộc hay nướng.' },
        { name: 'Thịt lợn sạch', price: 120000, image: './assets/images/List_Image_TCDD/ThitLonSach.png', description: 'Thịt lợn sạch, không kháng sinh, thịt mềm. Thích hợp kho, nướng hay xào.' },
        { name: 'Thịt bò tươi', price: 280000, image: './assets/images/List_Image_TCDD/ThitBoTuoi.png', description: 'Thịt bò tươi, nhiều protein, thích hợp nướng hay hầm với rau.' },
        { name: 'Thịt vịt', price: 110000, image: './assets/images/List_Image_TCDD/ThitVit.png', description: 'Thịt vịt thơm, giàu hương vị, phù hợp nướng hay kho các mon ngon.' },
        { name: 'Cá rô phi', price: 75000, image: './assets/images/List_Image_TCDD/CaRoPhi.png', description: 'Cá rô phi tươi, thịt trắng, phù hợp chiên hay kho với nước dùng.' },
        { name: 'Cá chép tươi', price: 85000, image: './assets/images/List_Image_TCDD/CaChepTuoi.png', description: 'Cá chép tươi, phù hợp nấu canh hay kho. Thịt thơm, đầy đủ dinh dưỡng.' },
        { name: 'Thịt gà đốt', price: 105000, image: './assets/images/List_Image_TCDD/ThitGaDot.png', description: 'Thịt gà đốt săn chắc, giàu collagen, phù hợp nấu súp hay hầm.' },
        { name: 'Thịt nạc vai', price: 135000, image: './assets/images/List_Image_TCDD/ThitNacVai.png', description: 'Thịt nạc vai mềm, mỡ vừa phải, phù hợp xào hay nướng tươi ngon.' },
        { name: 'Cá lóc tươi', price: 95000, image: './assets/images/List_Image_TCDD/CaLocTuoi.png', description: 'Cá lóc tươi, thịt chắc, thơm, phù hợp nấu canh hay kho đặc sắc.' },
        { name: 'Thịt chân gà', price: 65000, image: './assets/images/List_Image_TCDD/ThitChanGa.png', description: 'Thịt chân gà giàu collagen, phù hợp kho hay hầm, làm món nhậu ngon.' },
        { name: 'Trứng gà H\'mông', price: 6600, image: './assets/images/List_Image_TCDD/TrungGaHMong.png', description: 'Trứng gà H\'mông sạch, lòng đỏ cam tươi, giàu chất dinh dưỡng. Luộc hay chiên đều ngon.' },
        { name: 'Trứng gà ri muối', price: 5600, image: './assets/images/List_Image_TCDD/TrungGaRiMuoi.png', description: 'Trứng gà ri muối kỵ, vị mặn thơm, lòng đỏ đậm. Ăn cơm hay làm canh chua.' },
        { name: 'Trứng gà so', price: 5200, image: './assets/images/List_Image_TCDD/TrungGaSo.png', description: 'Trứng gà so tươi sạch, lòng đỏ vàng ươm. Giàu protein, lutein tốt cho mắt.' },
        { name: 'Nem cuốn nhỏ rán', price: 50000, image: './assets/images/List_Image_TCDD/NemCuonNhoRan.png', description: 'Nem cuốn nhỏ rán giòn ngon, nhân thịt tươi. Ăn vặt hay phục vụ tiệc tùng.' }
    ],
    'trai-cay': [
        { name: 'Xoài cát', price: 45000, image: './assets/images/List_Image_TCTM/XoaiCat.png', description: 'Xoài cát chín vàng, vị ngọt thanh, mùi thơm đặc trưng. Tốt cho làm sinh tố hay ăn tươi.' },
        { name: 'Dưa hấu giống Nhật', price: 48000, image: './assets/images/List_Image_TCTM/DuaHauGiongNhat.png', description: 'Dưa hấu giống Nhật, thịt ngọt, nhiều nước, ít hạt. Mát, bổ sung nước tốt cho sức khỏe.' },
        { name: 'Ổi lê Đại Lan', price: 30000, image: './assets/images/List_Image_TCTM/OiLeDaiLan.png', description: 'Ổi lê ngọt thanh, giòn, giàu vitamin C. Ăn tươi hay ép nước rất ngon.' },
        { name: 'Ổi lê Phúc Lợi', price: 55000, image: './assets/images/List_Image_TCTM/OiLePhucLoi.png', description: 'Ổi lê Phúc Lợi thơm, ngọt, chọn lọc kỹ, thích hợp cho gia đình.' },
        { name: 'Bưởi Phúc Trạch', price: 65000, image: './assets/images/List_Image_TCTM/BuoiPhucTrach.png', description: 'Bưởi Phúc Trạch mọng nước, vị chua ngọt hài hòa, giàu vitamin C.' },
        { name: 'Hồng trứng Nghệ An', price: 115000, image: './assets/images/List_Image_TCTM/HongTrungNgheAn.png', description: 'Hồng trứng thơm ngon, vị ngọt đậm, thịt mọng nước. Thích hợp làm quà biếu.' },
        { name: 'Đu đủ ruột đỏ', price: 20000, image: './assets/images/List_Image_TCTM/DuDuRuotDo.png', description: 'Đu đủ ruột đỏ, vị ngọt, mềm, giàu enzyme papain giúp tiêu hóa tốt.' },
        { name: 'Dâu tây nhập khẩu', price: 85000, image: './assets/images/List_Image_TCTM/DauTayNhapKhau.png', description: 'Dâu tây nhập khẩu ngon ngọt, dùng trang trí, làm mứt hay ăn trực tiếp.' },
        { name: 'Cam sành', price: 38000, image: './assets/images/List_Image_TCTM/CamSanh.png', description: 'Cam sành ngon, vỏ mỏng, vị ngọt, giàu vitamin C, ép nước tuyệt vời.' },
        { name: 'Nho tím Mỹ', price: 72000, image: './assets/images/List_Image_TCTM/NhoTimMy.png', description: 'Nho tím nhập khẩu, vị ngọt đậm, chất chống oxy hóa cao, ăn ngay hay làm mứt.' }
    ]
};

const categoryMap = {
    'hang-kho': 'Hàng khô',
    'hai-san': 'Hải sản vùng miền',
    'rau-cu': 'Rau củ hữu cơ',
    'thit-ca': 'Thịt cá dân dã',
    'trai-cay': 'Trái cây theo mùa'
};

let currentProducts = [];
let currentCategory = 'hang-kho';

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || 'hang-kho';
}

function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <a href="ProductDetail.html?id=${encodeURIComponent(product.name)}" style="text-decoration: none; color: inherit;">
            <div class="product-item">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h6 class="product-name">${product.name}</h6>
                <div class="product-price">${product.price.toLocaleString('vi-VN')}₫</div>
            </div>
        </a>
    `).join('');
}

function sortProducts(sortType) {
    let sorted = [...currentProducts];
    
    if (sortType === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
    }
    
    renderProducts(sorted);
}

function init() {
    currentCategory = getQueryParam('category');
    currentProducts = productData[currentCategory] || productData['hang-kho'];
    
    document.getElementById('categoryName').textContent = categoryMap[currentCategory] || 'Hàng khô';
    document.getElementById('productCount').textContent = currentProducts.length;
    
    renderProducts(currentProducts);

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });
}

window.addEventListener('load', init);
