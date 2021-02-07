const user = document.querySelector('#user');
const pin = document.querySelector('#pin');
const loginArrow = document.querySelector('#login');
const modalContainer = document.querySelector('.modal-container');
const actualCurrentBalance = document.querySelector('.actual-current-balance');
const balanceContainer = document.querySelector('.accounts-section');
const currentTime = document.querySelector('.current-balance-semi-paragraph');
const transferValue = document.querySelector('#transfer');
const amountValue = document.querySelector('#amount');
const transferButton = document.querySelector('.transfer-right');
const mediaQueryContainer = document.querySelector('.media-query-container');
const mainContainer = document.querySelector('.main-container');
const closeButton = document.querySelector('.close-button');
const closeUser = document.querySelector('#close-user');
const closePin = document.querySelector('#close-pin');
const inflow = document.querySelector('.inflow');
const outflow = document.querySelector('.outflow');
const requestLoanButton = document.querySelector('.amount-button');
const requestLoan = document.querySelector('#request');
const interest = document.querySelector('.interest');
const sortArrow = document.querySelector('.sort-arrow');
const overlayContainer = document.querySelector('.overlay-container');
const overlayIcon = document.querySelector('.overlay-icon');
const overlayContentContainer = document.querySelector('.overlay-content');
const overlayText = document.querySelector('.overlay-text');
const account1 = {
    name: 'Grace Okereke',
    userPin: 0000,
    transactions: [250, -400, 7000, -300, 80000, 900, -1000]
}
const account2 = {
    name: 'Deolu Asenuga',
    userPin: 1111,
    transactions: [-440, 666000, -5555, 90000, 88999, 700000]
}
const accounts = [account1, account2];


class App {
    correctElement;
    constructor(accounts) {
        this.accounts = accounts;
        this.remove;
        this.changeNameToUserName(this.accounts);
        loginArrow.addEventListener('click', this.login.bind(this));
        transferButton.addEventListener('click', this.transferAmount.bind(this));
        closeButton.addEventListener('click', this.closeAccount.bind(this));
        requestLoanButton.addEventListener('click', this.requestLoanAmount.bind(this));
        overlayContainer.addEventListener('click', this.hideFeedbackMessage.bind());
    }
    changeNameToUserName(accounts) {
        accounts.forEach(element => element.userName = element.name.toLowerCase().split(' ').map(array_element => array_element[0]).join(''));
    }
    setCurrentTime() {
        const todayDate = new Date();
        const day = todayDate.getDate();
        let month = todayDate.getMonth();
        const year = todayDate.getFullYear();
        const currentHour = todayDate.getHours();
        const currentMinutes = todayDate.getMinutes();
        currentTime.textContent = `As of ${day}/${month < 10 ? "0"+String(month+1) : month}/${year}, ${currentHour}:${currentMinutes}`;
    }
    calcInterest() {
        if (this.accumulateBalance(this.correctElement) > 0) {
            const interestValue = (this.accumulateBalance(this.correctElement) * 1.15 * 1) / 100;
            interest.textContent = interestValue.toFixed(1);
        }
    }
    remove() {
        if (window.outerWidth < 1280) {
            mediaQueryContainer.style.display = "flex";
            mainContainer.style.display = "none";
            modalContainer.style.display = "none";
        } else {
            mediaQueryContainer.style.display = "none";
            mainContainer.style.display = "grid";
            modalContainer.style.display = "flex";

        }
    }
    accumulateBalance(account) {
        const total = account.transactions.reduce((acc, cum) => acc + cum);
        return total;
    }
    requestLoanAmount(event) {
        event.preventDefault();
        const amountLoan = Number(requestLoan.value);
        if (amountLoan > 0 && this.correctElement.transactions.some(element => element >= amountLoan * 0.1)) {
            this.correctElement.transactions.push(amountLoan);
            this.displayContent(this.correctElement);
            overlayContainer.style.display = 'flex';
            this.feedbackLoanMessage(amountLoan);
        }
        requestLoan.value = ' ';
    }
    transferAmount(event) {
        event.preventDefault();
        let correctTransferElement;
        correctTransferElement = this.accounts.find(element => element.userName === transferValue.value);
        if ((correctTransferElement ?.userName !== this.correctElement.userName) && (Number(amountValue.value) > 0) && (this.accumulateBalance(this.correctElement) > 0)) {
            correctTransferElement.transactions.push((Number(amountValue.value)));
            this.correctElement.transactions.push((Number(-amountValue.value)));
            this.displayContent(this.correctElement);
            overlayContainer.style.display = 'flex';
            this.feedbackCorrectMessage(amountValue.value, correctTransferElement.userName);
            transferValue.value = amountValue.value = "";
        }
        if ((correctTransferElement ?.userName === this.correctElement.userName) && (Number(amountValue.value) > 0)) {
            overlayContainer.style.display = 'flex';
            this.feedbackWrongMessage();
            transferValue.value = amountValue.value = "";
        }
    }
    closeAccount(event) {
        event.preventDefault();
        if (this.correctElement ?.userName === closeUser.value && this.correctElement ?.userPin === Number(closePin.value)) {
            let correctIndexNumber;
            correctIndexNumber = this.accounts.findIndex(element => element.userName === closeUser.value);
            this.accounts.splice(correctIndexNumber, 1);
            modalContainer.style.display = "none";
        }
        closeUser.value = closePin.value = "";
    }
    login(event) {
        event.preventDefault();
        this.correctElement = this.accounts.find(element => element.userName === user.value);
        if (this.correctElement ?.userPin === Number(pin.value) && this.correctElement.userName === user.value) {
            modalContainer.style.opacity = 100;
            this.displayContent(this.correctElement);
            actualCurrentBalance.textContent = this.accumulateBalance(this.correctElement) + '$';
            this.setCurrentTime();
        }
        pin.value = user.value = "";
    }
    displayContent(account) {
        account.transactions.forEach((element, index) => {
            const result = element > 0 ? "deposit" : "withdraw";
            const html = ` <div class="accounts-inner-section">
            <div class = "account-circle-box ${result}">
                <p class="account-text">${index + 1} ${result}</p>
            </div>
            <div class="amount-date-box">
                <p class="amount-date">12/07/2019</p>
            </div>
            <p class="amount-used">${element}</p>
        </div>
        </div>`;
            balanceContainer.insertAdjacentHTML('afterbegin', html);

        })
        const depositAccountTotal = account.transactions.filter(element => element > 0).reduce((acc, cum) => acc + cum, 0);
        const withdrawAccountTotal = account.transactions.filter(element => element < 0).reduce((acc, cum) => acc + cum, 0);

        inflow.textContent = `${depositAccountTotal}`;
        outflow.textContent = `${Math.abs(withdrawAccountTotal)}`;
        this.calcInterest();
    }
    feedbackCorrectMessage(amount,element){
       overlayContentContainer.classList.add('approve');
       overlayContentContainer.classList.remove('reject');
       overlayText.textContent = `You have successfully transfered ${amount}$ to ${element}`;
    }
    feedbackWrongMessage(){
        overlayContentContainer.classList.remove('approve');
        overlayContentContainer.classList.add('reject');
        overlayText.textContent = 'You cant transfer money to your own account.';
    }
    feedbackLoanMessage(amount) {
    overlayContentContainer.classList.add('approve');
    overlayContentContainer.classList.remove('reject');
    overlayText.textContent = `The loan requested has been successfully approved. Your account has successfully been credited with ${amount}`
}
    hideFeedbackMessage() {
        overlayContainer.style.display = 'none';
    }

}
let app = new App(accounts);
balanceContainer.scrollTop = balanceContainer.scrollHeight;
balanceContainer.scrollLeft = balanceContainer.scrollWidth;
window.addEventListener("resize", app.remove)
window.addEventListener("DOMContentLoaded", app.remove);