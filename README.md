# RNS

Študijná stránka k predmetu Riadenie nelineárnych systémov (STU FEI), https://greenybeany.dev/rns/

- `/rns/`: rozcestník
- `/rns/zapocet/`: otázky na zápočet (prehľad, hľadanie, kartičky, test, pokrok)
- `/rns/prednasky/`: prednášky v PDF

## Vývoj

```bash
npm install
npm run dev
```

`npm run build && npm run preview` pustí produkčnú verziu na http://localhost:4173/rns/.

## Pridanie prednášky

Daj PDF do `public/prednasky/` s názvom `NN-nazov.pdf` (napr. `05-ljapunovova-stabilita.pdf`),
commitni a pushni. Názov sa berie z mena súboru (pomlčky = medzery; diakritika v názve súboru je
povolená). Zoznam `src/data/prednasky.json` vygeneruje `scripts/prednasky.mjs` pred každým buildom.

## Otázky na zápočet

`src/data/questions.json` generuje `scripts/extract.py` zo `Zápočet_RNS*.pdf`
(`pip install pymupdf`, potom `npm run extract`). Sporné miesta sú v `ISSUES.md`.

## Nasadenie

Push do `main` spustí `.github/workflows/deploy.yml` (GitHub Actions → Pages).
V nastaveniach repozitára: Settings → Pages → Source: GitHub Actions.
