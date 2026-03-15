/**
 * Třída Auto -> její instance reprezentuje jedno konkrétní vozidlo a jeho schopnosti
 */
class Auto {
    znacka: string;
    palivo: number;
    najetoKm: number = 0;
    readonly spotrebaNaKm: number = 0.1; // 10 litrů na 100 km
    readonly maxKapacita: number = 60;

    constructor(znacka: string, pocatecniPalivo: number) {
        this.znacka = znacka;
        this.palivo = Number(pocatecniPalivo);
    }

    /**
     * Logika jízdy: prověří, zda má dost paliva na jízdu a přičte kilometry
     */
    jizda(vzdalenost: number): void {
        const potrebaPaliva = vzdalenost * this.spotrebaNaKm;

        if (this.palivo >= potrebaPaliva) {
            this.palivo -= potrebaPaliva;
            this.najetoKm += vzdalenost;
        } else {
            alert(`Auto ${this.znacka} nemá dostatek paliva na cestu!`);
        }
    }

    /**
     * Doplnění nádrže na maximum
     */
    natankovatPlnou(): void {
        this.palivo = this.maxKapacita;
    }

    /**
     * Rozhodne, zda auto překročilo servisní limit
     */
    potrebujeServis(): boolean {
        return this.najetoKm >= 1000;
    }

    /**
     * Vygeneruje HTML kód řádku pro tabulkové zobrazení (4 sloupce)
     */
    zobrazObjekt(id: number): string {
        const cssTrida = this.potrebujeServis() ? "w3-red" : "";

        return `
            <tr class="${cssTrida}">
                <td><strong>${this.znacka}</strong></td>
                <td>${this.palivo.toFixed(1)} l</td>
                <td>${this.najetoKm} km</td>
                <td>
                    <button onclick="ovladacJizdy(${id})" class="w3-button w3-blue w3-round">Ujeď 50 km</button>
                    <button onclick="ovladacTankovani(${id})" class="w3-button w3-orange w3-round">Plná nádrž</button>
                    <button onclick="ovladacSmazat(${id})" class="w3-button w3-white w3-border w3-round">Odstranit</button>
                </td>
            </tr>`;
    }
}

/**
 * Třída EvidenceVozidel - její instance spravuje celý vozový park a zobrazuje ho do tabulky
 */
class EvidenceVozidel {
    seznamAut: Auto[] = [];

    /**
     * Přidá nové auto do seznamu
     */
    pridatVozidlo(noveAuto: Auto): void {
        this.seznamAut.push(noveAuto);
        this.aktualizujTabulku();
    }

    /**
     * Odstraní auto z pole a překreslí tabulku
     */
    odstranitVozidlo(index: number): void {
        this.seznamAut.splice(index, 1);
        this.aktualizujTabulku();
    }

    /**
     * Hlavní vykreslovací smyčka
     */
    aktualizujTabulku(): void {
        const tbody = document.getElementById("tbodySeznamAut");
        if (!tbody) return;

        let html = "";
        let i = 0;

        // Procházíme pole objektů a skládáme výsledné HTML
        for (const auto of this.seznamAut) {
            html += auto.zobrazObjekt(i);
            i++;
        }

        tbody.innerHTML = html;
    }
}

// --- GLOBÁLNÍ INSTANCE A PROPOJOVACÍ FUNKCE ---

const mojeEvidence = new EvidenceVozidel();

/**
 * Reakce na tlačítko "Přidat auto" ve formuláři
 */
function pridejVozidlo(): void {
    const vstupZnacka = document.getElementById("txtZnacka") as HTMLInputElement;
    const vstupPalivo = document.getElementById("txtPalivo") as HTMLInputElement;

    if (vstupZnacka.value.trim() === "") {
        alert("Zadejte značku vozu.");
        return;
    }

    const noveAuto = new Auto(vstupZnacka.value, vstupPalivo.valueAsNumber);
    mojeEvidence.pridatVozidlo(noveAuto);

    // Vyčištění formuláře pro další zadávání
    vstupZnacka.value = "";
    vstupPalivo.value = "";
}

/**
 * Obsluha tlačítka "Ujeď 50 km"
 *  - událostí spouštěná funkce
 */
function ovladacJizdy(index: number): void {
    const auto = mojeEvidence.seznamAut[index];
    if (auto) {
        auto.jizda(50);
        mojeEvidence.aktualizujTabulku();
    }
}

/**
 * Obsluha tlačítka "Plná nádrž" - událostí spouštěná funkce
 */
function ovladacTankovani(index: number): void {
    const auto = mojeEvidence.seznamAut[index];
    if (auto) {
        auto.natankovatPlnou();
        mojeEvidence.aktualizujTabulku();
    }
}

/**
 * Obsluha tlačítka "Odstranit" - událostí spouštěná funkce
 */
function ovladacSmazat(index: number): void {
    const auto = mojeEvidence.seznamAut[index];
    if (auto && confirm(`Opravdu chcete smazat vůz ${auto.znacka}?`)) {
        mojeEvidence.odstranitVozidlo(index);
    }
}