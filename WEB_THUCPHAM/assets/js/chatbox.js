// AI Chatbox using Groq API with Chat History & User Info Collection
class AIChatbox {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'llama-3.3-70b-versatile';
        this.conversationHistory = [];
        this.chatHistory = []; // Lưu toàn bộ lịch sử chat
        this.userInfo = {}; // Thu thập thông tin người dùng
        this.init();
    }

    init() {
        this.loadChatHistory(); // Tải lịch sử từ localStorage
        this.loadUserInfo(); // Tải thông tin người dùng
        this.createChatboxHTML();
        this.attachEventListeners();
        this.displayChatHistory(); // Hiển thị lịch sử đã lưu
    }

    createChatboxHTML() {
        const chatboxHTML = `
            <div class="ai-chatbox-container">
                <!-- Toggle Button -->
                <button class="chatbox-toggle-btn" id="chatboxToggle">
                    <i class="fa-solid fa-comments"></i>
                </button>

                <!-- Chatbox Window -->
                <div class="chatbox-window" id="chatboxWindow">
                    <!-- Header -->
                    <div class="chatbox-header">
                        <div class="chatbox-header-info">
                            <div class="chatbox-avatar">
                                <i class="fa-solid fa-robot"></i>
                            </div>
                            <div class="chatbox-title">
                                <h4>AI Assistant</h4>
                                <p>Hỗ trợ bởi web</p>
                            </div>
                        </div>
                        <div class="chatbox-actions">
                            <button class="chatbox-action-btn" id="chatboxInfo" title="Thông tin đã thu thập">
                                <i class="fa-solid fa-info-circle"></i>
                            </button>
                            <button class="chatbox-action-btn" id="chatboxExport" title="Xuất lịch sử chat">
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <button class="chatbox-action-btn" id="chatboxClear" title="Xóa lịch sử chat">
                                <i class="fa-solid fa-trash-alt"></i>
                            </button>
                            <button class="chatbox-close" id="chatboxClose">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Messages Area -->
                    <div class="chatbox-messages" id="chatboxMessages">
                        <!-- Messages will be loaded here -->
                    </div>

                    <!-- Typing Indicator -->
                    <div class="typing-indicator" id="typingIndicator">
                        <div class="message-avatar">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="chatbox-input-area">
                        <div class="chatbox-input-wrapper">
                            <input 
                                type="text" 
                                id="chatboxInput" 
                                placeholder="Nhập tin nhắn của bạn..."
                                autocomplete="off"
                            />
                            <button class="chatbox-send-btn" id="chatboxSend">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatboxHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatboxToggle');
        const closeBtn = document.getElementById('chatboxClose');
        const sendBtn = document.getElementById('chatboxSend');
        const input = document.getElementById('chatboxInput');
        const chatboxWindow = document.getElementById('chatboxWindow');
        const clearBtn = document.getElementById('chatboxClear');
        const exportBtn = document.getElementById('chatboxExport');
        const infoBtn = document.getElementById('chatboxInfo');

        // Toggle chatbox
        toggleBtn.addEventListener('click', () => {
            chatboxWindow.classList.toggle('active');
            if (chatboxWindow.classList.contains('active')) {
                input.focus();
            }
        });

        // Close chatbox
        closeBtn.addEventListener('click', () => {
            chatboxWindow.classList.remove('active');
        });

        // Send message on button click
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Clear chat history
        clearBtn.addEventListener('click', () => {
            this.clearChatHistory();
        });

        // Export chat history
        exportBtn.addEventListener('click', () => {
            this.exportChatHistory();
        });

        // Show user info
        infoBtn.addEventListener('click', () => {
            this.showUserInfo();
        });
    }

    // Tải lịch sử chat từ localStorage
    loadChatHistory() {
        try {
            const history = localStorage.getItem('freshbite_chat_history');
            if (history) {
                this.chatHistory = JSON.parse(history);
                console.log('✅ Đã tải lịch sử chat:', this.chatHistory.length, 'tin nhắn');
            }
        } catch (e) {
            console.error('❌ Lỗi tải lịch sử chat:', e);
            this.chatHistory = [];
        }
    }

    // Lưu lịch sử chat vào localStorage
    saveChatHistory() {
        try {
            localStorage.setItem('freshbite_chat_history', JSON.stringify(this.chatHistory));
            console.log('💾 Đã lưu lịch sử chat:', this.chatHistory.length, 'tin nhắn');
        } catch (e) {
            console.error('❌ Lỗi lưu lịch sử chat:', e);
        }
    }

    // Tải thông tin người dùng từ localStorage
    loadUserInfo() {
        try {
            const info = localStorage.getItem('freshbite_user_info');
            if (info) {
                this.userInfo = JSON.parse(info);
                console.log('✅ Đã tải thông tin người dùng:', this.userInfo);
            }
        } catch (e) {
            console.error('❌ Lỗi tải thông tin người dùng:', e);
            this.userInfo = {};
        }
    }

    // Lưu thông tin người dùng vào localStorage
    saveUserInfo() {
        try {
            localStorage.setItem('freshbite_user_info', JSON.stringify(this.userInfo));
            console.log('💾 Đã lưu thông tin người dùng:', this.userInfo);
        } catch (e) {
            console.error('❌ Lỗi lưu thông tin người dùng:', e);
        }
    }

    // Hiển thị lại lịch sử chat
    displayChatHistory() {
        const messagesContainer = document.getElementById('chatboxMessages');
        messagesContainer.innerHTML = ''; // Xóa nội dung cũ

        if (this.chatHistory.length === 0) {
            // Tin nhắn chào mừng mặc định
            this.addMessage('Xin chào! Tôi là Fresh Bite AI. Tôi có thể giúp gì cho bạn hôm nay? 🌿', 'bot', false);
        } else {
            // Hiển thị lịch sử
            this.chatHistory.forEach(entry => {
                const messageHTML = this.createMessageHTML(entry.message, entry.sender, entry.timestamp);
                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            });
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Tạo HTML cho tin nhắn
    createMessageHTML(text, sender, timestamp) {
        const messageClass = sender === 'user' ? 'user' : 'bot';
        const avatarIcon = sender === 'user' 
            ? '<i class="fa-solid fa-user"></i>' 
            : '<i class="fa-solid fa-robot"></i>';
        
        const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }) : '';

        return `
            <div class="chat-message ${messageClass}">
                <div class="message-avatar">${avatarIcon}</div>
                <div class="message-content">
                    <p>${this.formatMessage(text)}</p>
                    ${timeStr ? `<span class="message-time">${timeStr}</span>` : ''}
                </div>
            </div>
        `;
    }

    // Thêm tin nhắn mới
    addMessage(text, sender, shouldSave = true) {
        const messagesContainer = document.getElementById('chatboxMessages');
        const timestamp = new Date().toISOString();
        
        const messageHTML = this.createMessageHTML(text, sender, timestamp);
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Lưu vào lịch sử
        if (shouldSave) {
            const chatEntry = {
                message: text,
                sender: sender,
                timestamp: timestamp
            };
            this.chatHistory.push(chatEntry);
            this.saveChatHistory();

            // Thu thập thông tin nếu là tin nhắn của người dùng
            if (sender === 'user') {
                this.extractUserInfo(text);
            }
        }
    }

    formatMessage(text) {
        const escaped = this.escapeHTML(text);
        return escaped.replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.add('active');
        const messagesContainer = document.getElementById('chatboxMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.remove('active');
    }

    async sendMessage() {
        const input = document.getElementById('chatboxInput');
        const sendBtn = document.getElementById('chatboxSend');
        const message = input.value.trim();

        if (!message) return;

        // Disable input while processing
        input.disabled = true;
        sendBtn.disabled = true;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call Groq API
            const response = await this.callGroqAPI(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();

            // Add bot response
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.hideTypingIndicator();
            
            let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. ';
            if (error.message.includes('API_KEY_INVALID') || error.message.includes('key')) {
                errorMessage += 'API key không hợp lệ. Vui lòng kiểm tra lại key của bạn.';
            } else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
                errorMessage += 'API quota đã hết. Vui lòng thử lại sau.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage += 'Lỗi kết nối mạng. Vui lòng kiểm tra internet của bạn.';
            } else {
                errorMessage += 'Vui lòng thử lại sau.';
            }
            
            this.addErrorMessage(errorMessage);
        } finally {
            // Re-enable input
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    async callGroqAPI(userMessage) {
        if (!this.apiKey || this.apiKey === '') {
            throw new Error('API key not configured');
        }

        // Thêm thông tin người dùng vào context nếu có
        let userInfoContext = '';
        if (Object.keys(this.userInfo).length > 0) {
            userInfoContext = `\n\n📋 THÔNG TIN KHÁCH HÀNG ĐÃ THU THẬP:\n${JSON.stringify(this.userInfo, null, 2)}\n(Sử dụng thông tin này để cá nhân hóa câu trả lời)`;
        }

        const systemContext = `Bạn là trợ lý AI thông minh của CỬA HÀNG THỰC PHẨM SẠCH - Fresh Bite. 

📍 THÔNG TIN CƠ BẢN:
- Thành lập: 2020
- Địa điểm: 20 cửa hàng trên khắp Đà Nẵng
- Nhân viên: Gần 500 người
- Hotline: 0123456789
- Email: trangle231004@gmail.com
- Giờ làm việc: 6h00 - 19h30 hàng ngày
- Giao hàng: Trong 2 giờ, miễn phí đơn từ 500.000đ

🎯 TẦM NHÌN & SỨ MỆNH:
- Trở thành nhà cung cấp thực phẩm sạch được tin tưởng nhất ở Đà Nẵng
- Cung cấp sản phẩm chất lượng cao, an toàn, giá cả hợp lý
- Phục vụ hàng chục nghìn khách hàng mỗi ngày

✅ CAM KẾT CHẤT LƯỢNG:
- Quy trình thuận tự nhiên (không hóa chất độc hại)
- Chuỗi cung ứng tiêu chuẩn (giám sát nghiêm ngặt)
- Nguồn gốc minh bạch (có thể truy xuất)
- Kiểm định chất lượng nghiêm ngặt
- Chuỗi lạnh hiện đại bảo quản
- Tuân thủ tiêu chuẩn an toàn thực phẩm quốc tế

🛍️ 5 DANH MỤC SẢN PHẨM CHÍNH:

1️⃣ HẢI SẢN VÙNG MIỀN (12 sản phẩm):
- Tôm hùm (450k), Tôm rừng hấp (498k), Cá hồi fillet (824k), Cá hồi fillet Nauy (280k)
- Cá rói chiên sơ (184k), Cá đầm lúa Thanh Lãng (120k), Cá bớp tươi (280k)
- Mực tươi (320k), Cua hoàng đế (650k), Cua xanh tươi (380k)
- Nghêu tươi (250k), Sò lớn (180k)

2️⃣ HÀNG KHÔ (11 sản phẩm):
- Gạo séng cù Lào Cai (53k), Nấm khô (110k), Hạt điều rang (120k)
- Hạnh nhân rang (95k), Mơ khô (85k), Nho khô (102k)
- Rau củ sấy khô (50k), Cà chua sấy (65k), Khoai lang sấy (55k)
- Mít sấy (85k), Dưa hấu khô (75k)

3️⃣ RAU CỦ HỮU CƠ (14 sản phẩm):
- Đậu phụ bìa (6k), Rau cải xanh (25k), Cà chua tươi (35k)
- Bắp cải (52k), Quả su su (52k), Dưa chuột (28k)
- Ớt chuông (42k), Rau muống (18k), Cải thìa (22k)
- Bông cải xanh (48k), Khoai lang (30k), Cải ngồng RH (23k)
- Rau thơm tổng hợp RB (70k), Thì là RB (395k - quý hiếm)

4️⃣ THỊT CÁ DÂN DÃ (15 sản phẩm):
- Trứng gà H'mông (6.6k), Trứng gà ri muối (5.6k), Trứng gà so (5.2k)
- Thịt gà tươi (95k), Thịt gà đốt (105k), Thịt chân gà (65k)
- Thịt lợn sạch (120k), Thịt nạc vai (135k), Thịt bò tươi (280k)
- Thịt vịt (110k), Cá rô phi (75k), Cá chép tươi (85k)
- Cá lóc tươi (95k), Bánh ram Hà Tĩnh (45k), Nem cuốn nhỏ rán (50k)

5️⃣ TRÁI CÂY THEO MÙA (10 sản phẩm):
- Ổi lê Đại Lan (30k), Ổi lê Phúc Lợi (55k)
- Hồng trứng Nghệ An (115k - đặc sản)
- Bưởi Phúc Trạch (65k), Đu đủ ruột đỏ (20k)
- Dưa hấu giống Nhật (48k), Xoài cát (45k)
- Cam sành (38k), Nho tím Mỹ (72k), Dâu tây nhập khẩu (85k)

🏪 20 CHI NHÁNH TẠI ĐÀ NẴNG:
- Chi nhánh 01: Số 45 Nguyễn Công Trứ, Hải Châu (0236123456 / 0967234567)
- Chi nhánh 02: Số 120 Lê Duẩn, Hải Châu (0236234567)
- Chi nhánh 03: Số 78 Trần Phú, Thanh Khê (0236345678)
- Chi nhánh 04: Số 56 Lý Thái Tổ, Hải Châu (0236456789)
- Chi nhánh 05: Số 89 Hoàng Văn Thụ, Thanh Khê (0236567890 / 0968345678)
- Chi nhánh 06: Số 234 Quang Trung, Hải Châu (0236678901)
- Chi nhánh 07: Số 167 Phạm Văn Đồng, Cẩm Lệ
- Và 13 chi nhánh khác trên khắp Đà Nẵng

📦 CHÍNH SÁCH:
- Đổi trả: 7 ngày, hoàn tiền 100% nếu lỗi
- Giao hàng: 2 giờ, miễn phí từ 500k
- Thành viên VIP: Giảm 10%, ưu tiên giao hàng, tích điểm đổi quà
- Bảo quản: Hướng dẫn chi tiết cho từng loại sản phẩm

💚 GIÁ TRỊ CỐT LÕI:
- 🌱 Tự nhiên: Ưu tiên hữu cơ, không hóa chất
- ✨ Chất lượng: Không thỏa hiệp
- 💚 Trách nhiệm: Với khách hàng, cộng đồng và môi trường

📋 NHIỆM VỤ CỦA BẠN:
1. Trả lời thân thiện, chuyên nghiệp về sản phẩm
2. Tư vấn dinh dưỡng, cách chế biến, bảo quản
3. Giới thiệu sản phẩm phù hợp với nhu cầu
4. Giải đáp về nguồn gốc, chất lượng, chính sách
5. Hướng dẫn địa chỉ chi nhánh, liên hệ
6. Trả lời ngắn gọn, dễ hiểu, dùng emoji phù hợp
7. Luôn nêu rõ GIÁ và ĐẶC ĐIỂM sản phẩm khi giới thiệu
8. Thu thập thông tin khách hàng một cách tự nhiên (tên, số điện thoại, email, địa chỉ)

⚠️ LƯU Ý:
- Chỉ giới thiệu sản phẩm CÓ TRONG DANH SÁCH
- Luôn đề xuất 2-3 sản phẩm phù hợp với ngân sách
- Khi khách hỏi về địa chỉ, gợi ý chi nhánh gần nhất
- Nhấn mạnh cam kết chất lượng và nguồn gốc rõ ràng
- Thu thập thông tin khách hàng để phục vụ tốt hơn

${userInfoContext}

Phong cách: Thân thiện, nhiệt tình, chuyên nghiệp, tin cậy 🌿`;

        const requestBody = {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: systemContext
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || '';
                
                console.error('API Error:', errorMsg, 'Status:', response.status);
                
                if (response.status === 401) {
                    throw new Error('API_KEY_INVALID: ' + (errorMsg || 'Key không hợp lệ'));
                } else if (response.status === 429) {
                    throw new Error('RESOURCE_EXHAUSTED: Quota đã hết');
                } else if (response.status === 403) {
                    throw new Error('PERMISSION_DENIED: Key không có quyền');
                } else {
                    throw new Error(errorMsg || `HTTP ${response.status}: Request failed`);
                }
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0]?.message?.content) {
                return data.choices[0].message.content;
            } else if (data.error) {
                throw new Error(data.error.message || 'API error');
            } else {
                console.error('Invalid response:', data);
                throw new Error('Invalid response format');
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('network: Không thể kết nối. Kiểm tra internet của bạn.');
            }
            throw error;
        }
    }

    // Thu thập thông tin từ tin nhắn người dùng
    extractUserInfo(message) {
        const lowerMessage = message.toLowerCase();
        let updated = false;

        // Tìm số điện thoại (10-11 số, bắt đầu bằng 0 hoặc +84)
        const phoneRegex = /(0\d{9,10}|\+84\d{9,10})/g;
        const phones = message.match(phoneRegex);
        if (phones && phones.length > 0 && !this.userInfo.phone) {
            this.userInfo.phone = phones[0];
            updated = true;
            console.log('📞 Thu thập được số điện thoại:', phones[0]);
        }

        // Tìm email
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
        const emails = message.match(emailRegex);
        if (emails && emails.length > 0 && !this.userInfo.email) {
            this.userInfo.email = emails[0];
            updated = true;
            console.log('📧 Thu thập được email:', emails[0]);
        }

        // Tìm tên
        const namePatterns = [
            /(?:tôi là|tên tôi là|mình là|mình tên|tên mình là|tên là|họ tên)\s+([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]{2,50})/i
        ];

        for (const pattern of namePatterns) {
            const match = message.match(pattern);
            if (match && match[1] && !this.userInfo.name) {
                const name = match[1].trim();
                if (name.length >= 2 && name.length <= 50) {
                    this.userInfo.name = name;
                    updated = true;
                    console.log('👤 Thu thập được tên:', name);
                    break;
                }
            }
        }

        // Tìm địa chỉ
        const addressPatterns = [
            /(?:địa chỉ|ở tại|sống tại|ở)\s*[:\-]?\s*(.{10,})/i
        ];

        for (const pattern of addressPatterns) {
            const match = message.match(pattern);
            if (match && match[1] && !this.userInfo.address) {
                const address = match[1].trim();
                // Loại bỏ các từ không liên quan
                if (address.length >= 10 && !address.match(/^(nào|gì|đâu|vậy|nhỉ|à)/i)) {
                    this.userInfo.address = address;
                    updated = true;
                    console.log('📍 Thu thập được địa chỉ:', address);
                    break;
                }
            }
        }

        // Lưu nếu có cập nhật
        if (updated) {
            this.saveUserInfo();
        }
    }

    // Xóa lịch sử chat
    clearChatHistory() {
        if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?\n\nThông tin người dùng sẽ được giữ lại.')) {
            this.chatHistory = [];
            this.conversationHistory = [];
            this.saveChatHistory();
            
            const messagesContainer = document.getElementById('chatboxMessages');
            messagesContainer.innerHTML = '';
            
            this.addMessage('Lịch sử chat đã được xóa. Tôi có thể giúp gì cho bạn? 🌿', 'bot', false);
            
            console.log('🗑️ Đã xóa lịch sử chat');
        }
    }

    // Xuất lịch sử chat
    exportChatHistory() {
        if (this.chatHistory.length === 0) {
            alert('Chưa có lịch sử chat để xuất!');
            return;
        }

        const exportData = {
            exportDate: new Date().toLocaleString('vi-VN'),
            storeName: 'Fresh Bite - Cửa hàng thực phẩm sạch',
            userInfo: this.userInfo,
            totalMessages: this.chatHistory.length,
            chatHistory: this.chatHistory
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `freshbite_chat_${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('✅ Đã xuất lịch sử chat thành công!');
        console.log('💾 Đã xuất lịch sử chat');
    }

    // Hiển thị thông tin người dùng đã thu thập
    showUserInfo() {
        const hasInfo = Object.keys(this.userInfo).length > 0;
        
        if (!hasInfo) {
            alert('Chưa thu thập được thông tin người dùng.\n\nHãy chia sẻ tên, số điện thoại, email hoặc địa chỉ của bạn trong cuộc trò chuyện!');
            return;
        }

        let infoText = '📋 THÔNG TIN ĐÃ THU THẬP:\n\n';
        
        if (this.userInfo.name) {
            infoText += `👤 Tên: ${this.userInfo.name}\n`;
        }
        if (this.userInfo.phone) {
            infoText += `📞 Số điện thoại: ${this.userInfo.phone}\n`;
        }
        if (this.userInfo.email) {
            infoText += `📧 Email: ${this.userInfo.email}\n`;
        }
        if (this.userInfo.address) {
            infoText += `📍 Địa chỉ: ${this.userInfo.address}\n`;
        }
        
        infoText += `\n✅ Tổng số tin nhắn: ${this.chatHistory.length}`;
        infoText += `\n📅 Lần cuối: ${this.chatHistory.length > 0 ? new Date(this.chatHistory[this.chatHistory.length - 1].timestamp).toLocaleString('vi-VN') : 'N/A'}`;

        alert(infoText);
    }

    addErrorMessage(text) {
        const messagesContainer = document.getElementById('chatboxMessages');
        const errorHTML = `
            <div class="error-message">
                <i class="fa-solid fa-exclamation-circle"></i> ${this.escapeHTML(text)}
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', errorHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbox
document.addEventListener('DOMContentLoaded', function() {
    const GROQ_API_KEY = '---------------------------';
    
    try {
        window.aiChatbox = new AIChatbox(GROQ_API_KEY);
        console.log('✅ AI Chatbox đã khởi tạo với tính năng:');
        console.log('   💬 Lưu lịch sử chat tự động');
        console.log('   📋 Thu thập thông tin khách hàng');
        console.log('   💾 Xuất dữ liệu chat');
        console.log('   🗑️ Xóa lịch sử');
    } catch (error) {
        console.error('❌ Lỗi khởi tạo chatbox:', error);
    }
});
