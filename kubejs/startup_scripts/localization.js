// priority: 1000

// Typewriter effects need a literal string before they animate each character.
// Resolve it using the recipient's locale, rather than the server's language.
const pocEnglish = JSON.parse(JsonIO.readString('kubejs/assets/rain/lang/en_us.json'))
const pocChinese = JSON.parse(JsonIO.readString('kubejs/assets/rain/lang/zh_cn.json'))

global.pocText = (player, key) => {
    const locale = String(player.clientInformation().language()).toLowerCase()
    const translations = locale.startsWith('zh_') ? pocChinese : pocEnglish
    return String(translations[key] != null ? translations[key] : pocEnglish[key] != null ? pocEnglish[key] : key)
}
