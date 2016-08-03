/*身份证号规则：
    * 15位:
    * 420982 62 05 06 677
    * 1-6位：地区代码，7-8位：出生年份，9-10位：出生月份，11-12位：出生日期，13-15位：顺序号；奇数男性，偶数女性。
    *
    * 18位：
    * 42 09 82 1962 05 06 6779
    * 地址码（1-2位：省级政府代码，3-4位：地、市级政府代码，5-6位：县、区级政府代码），出生日期码（7-10位：出生年份，11-12位：出生月份，13-14位：出生日期），
    * 15-17位：同地址码同出生日期码的人编定的顺序码；奇数男性，偶数女性，18位：校验码，MOD 11-2校验码系统，‘X’代替‘10’。
    *
    * 18位校验码计算方法：
    * https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E5%85%AC%E6%B0%91%E8%BA%AB%E4%BB%BD%E5%8F%B7%E7%A0%81
    * 1. 将身份证号码从右至左标记为a_1 , a_2 , ... , a_{18}，a_{1}即为校验码；
    * 2. 计算权重系数W_i = 2^{i-1} mod {11}；
    * 3. 计算S = \sum_{i=2}^{18} a_i * W_i
    * 4. a_{1} = (12 - (S mod 11)) mod 11
    *
    *
    * isTrue: 身份证是否有效。默认false
    * year: 出生年
    * month: 出生月
    * day: 出生日
    * sex: 性别 0 女性， 1 男性
    *
*/

export default class CheckIdCard {
    constructor(card) {
        this.card = card;
        this.info = {
            isTrue: false,
            year: null,
            month: null,
            day: null,
            sex: null
        };
        this.basicChecked();
    }

    basicChecked() {
        let card = this.card;
        if(card && (15 == card.length || 18 == card.length)) {
            this.cardChecked();
        } else {
            this.info.isTrue = false;
            return this.info;
        }
    }

    cardChecked() {
        let card = this.card,
            info = this.info,
            year, month, day, sex;

        if(15 == card.length) {
            year = card.substring(6, 8);
            month = card.substring(8, 10);
            day = card.substring(10, 12);
            sex = card.substring(14, 15);

            if( 0 < month <= 12 && 0 < day <= 31) {
                info.year = '19' + year;
                sex % 2 == 0 ? info.sex = 0 : info.sex = 1;
            } else {
                return info.isTrue = false;
            }
        }

        if(18 == card.length) {
            year = card.substring(6, 10);
            month = card.substring(10, 12);
            day = card.substring(12, 14);
            sex = card.substring(14, 17);

            let check = card.substring(17, 18);

            if(!((new Date().getFullYear() - 100) < year < new Date().getFullYear() && 0 < month <= 12 && 0 < day <= 31)) {
                return info.isTrue = false;
            }
            if(check.toLowerCase() == 'x') {check = 10}
            if(check != this.calcChecksum(card.substring(0, 17))) {
                return info.isTrue = false;
            } else {
                info.year = year;
            }
        }

        info.month = month;
        info.day = day;
        info.sex = sex % 2;
        info.isTrue = true;

        return info;
    }

    //校验码
    calcChecksum(rid) {
        var arr = rid.split('').reverse();
        function W(i) {
            return Math.pow(2, i - 1) % 11;
        }
        function S() {
            var sum = 0;
            for(var j = 0; j < 17; j++) {
                sum += arr[j]*W(j+2);
            }

            return sum;
        }
        return (12-(S() % 11)) % 11;
    }
}

