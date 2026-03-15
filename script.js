/**
 * Třída Auto -> její instance reprezentuje jedno konkrétní vozidlo a jeho schopnosti
 */
var Auto = /** @class */ (function () {
    function Auto(znacka, pocatecniPalivo) {
        this.najetoKm = 0;
        this.spotrebaNaKm = 0.1; // 10 litrů na 100 km
        this.maxKapacita = 60;
        this.znacka = znacka;
        this.palivo = Number(pocatecniPalivo);
    }
    /**
     * Logika jízdy: prověří, zda má dost paliva na jízdu a přičte kilometry
     */
    Auto.prototype.jizda = function (vzdalenost) {
        var potrebaPaliva = vzdalenost * this.spotrebaNaKm;
        if (this.palivo >= potrebaPaliva) {
            this.palivo -= potrebaPaliva;
            this.najetoKm += vzdalenost;
        }
        else {
            alert("Auto ".concat(this.znacka, " nem\u00E1 dostatek paliva na cestu!"));
        }
    };
    /**
     * Doplnění nádrže na maximum
     */
    Auto.prototype.natankovatPlnou = function () {
        this.palivo = this.maxKapacita;
    };
    /**
     * Rozhodne, zda auto překročilo servisní limit
     */
    Auto.prototype.potrebujeServis = function () {
        return this.najetoKm >= 1000;
    };
    /**
     * Vygeneruje HTML kód řádku pro tabulkové zobrazení (4 sloupce)
     */
    Auto.prototype.zobrazObjekt = function (id) {
        var cssTrida = this.potrebujeServis() ? "w3-red" : "";
        return "\n            <tr class=\"".concat(cssTrida, "\">\n                <td><strong>").concat(this.znacka, "</strong></td>\n                <td>").concat(this.palivo.toFixed(1), " l</td>\n                <td>").concat(this.najetoKm, " km</td>\n                <td>\n                    <button onclick=\"ovladacJizdy(").concat(id, ")\" class=\"w3-button w3-blue w3-round\">Uje\u010F 50 km</button>\n                    <button onclick=\"ovladacTankovani(").concat(id, ")\" class=\"w3-button w3-orange w3-round\">Pln\u00E1 n\u00E1dr\u017E</button>\n                    <button onclick=\"ovladacSmazat(").concat(id, ")\" class=\"w3-button w3-white w3-border w3-round\">Odstranit</button>\n                </td>\n            </tr>");
    };
    return Auto;
}());
/**
 * Třída EvidenceVozidel - její instance spravuje celý vozový park a zobrazuje ho do tabulky
 */
var EvidenceVozidel = /** @class */ (function () {
    function EvidenceVozidel() {
        this.seznamAut = [];
    }
    /**
     * Přidá nové auto do seznamu
     */
    EvidenceVozidel.prototype.pridatVozidlo = function (noveAuto) {
        this.seznamAut.push(noveAuto);
        this.aktualizujTabulku();
    };
    /**
     * Odstraní auto z pole a překreslí tabulku
     */
    EvidenceVozidel.prototype.odstranitVozidlo = function (index) {
        this.seznamAut.splice(index, 1);
        this.aktualizujTabulku();
    };
    /**
     * Hlavní vykreslovací smyčka
     */
    EvidenceVozidel.prototype.aktualizujTabulku = function () {
        var tbody = document.getElementById("tbodySeznamAut");
        if (!tbody)
            return;
        var html = "";
        var i = 0;
        // Procházíme pole objektů a skládáme výsledné HTML
        for (var _i = 0, _a = this.seznamAut; _i < _a.length; _i++) {
            var auto = _a[_i];
            html += auto.zobrazObjekt(i);
            i++;
        }
        tbody.innerHTML = html;
    };
    return EvidenceVozidel;
}());
// --- GLOBÁLNÍ INSTANCE A PROPOJOVACÍ FUNKCE ---
var mojeEvidence = new EvidenceVozidel();
/**
 * Reakce na tlačítko "Přidat auto" ve formuláři
 */
function pridejVozidlo() {
    var vstupZnacka = document.getElementById("txtZnacka");
    var vstupPalivo = document.getElementById("txtPalivo");
    if (vstupZnacka.value.trim() === "") {
        alert("Zadejte značku vozu.");
        return;
    }
    var noveAuto = new Auto(vstupZnacka.value, vstupPalivo.valueAsNumber);
    mojeEvidence.pridatVozidlo(noveAuto);
    // Vyčištění formuláře pro další zadávání
    vstupZnacka.value = "";
    vstupPalivo.value = "";
}
/**
 * Obsluha tlačítka "Ujeď 50 km"
 *  - událostí spouštěná funkce
 */
function ovladacJizdy(index) {
    var auto = mojeEvidence.seznamAut[index];
    if (auto) {
        auto.jizda(50);
        mojeEvidence.aktualizujTabulku();
    }
}
/**
 * Obsluha tlačítka "Plná nádrž" - událostí spouštěná funkce
 */
function ovladacTankovani(index) {
    var auto = mojeEvidence.seznamAut[index];
    if (auto) {
        auto.natankovatPlnou();
        mojeEvidence.aktualizujTabulku();
    }
}
/**
 * Obsluha tlačítka "Odstranit" - událostí spouštěná funkce
 */
function ovladacSmazat(index) {
    var auto = mojeEvidence.seznamAut[index];
    if (auto && confirm("Opravdu chcete smazat v\u016Fz ".concat(auto.znacka, "?"))) {
        mojeEvidence.odstranitVozidlo(index);
    }
}
