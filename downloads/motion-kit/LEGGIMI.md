# HANGOVER — Motion Studio

12 composizioni animate e personalizzabili. Studio autonomo, senza account o connessione.

## Apri e personalizza

1. Apri `HANGOVER-MOTION-STUDIO.html` in un browser moderno.
2. Scegli uno dei 12 studi nella libreria. I file JSON numerati sono preset pronti, importabili con **Importa preset**.
3. Modifica formato, palette, titolo, dettaglio, durata ed effetti. Line-up accetta fino a quattro nomi, uno per riga. La foto personale resta nel browser e nei file esportati: non viene inviata a servizi esterni.
4. Usa il cursore per scegliere un fotogramma. **Fotogramma PNG** produce 1080 × 1920, 1080 × 1080 o 1920 × 1080 px.
5. **Esporta video** registra l'intera sequenza da zero. Tieni la scheda aperta. Il file è senza audio, con obiettivo 30 fps; fluidità e tempi effettivi dipendono dal browser e dal dispositivo. Il formato è MP4 se supportato, altrimenti WebM. Il link di download indica il formato effettivo.
6. **Template modificabile** genera una copia HTML autonoma con le modifiche; **Salva preset** conserva solo la configurazione in JSON, più l'eventuale foto caricata.

Le anteprime rispettano il pulsante di pausa del sito e la preferenza del dispositivo per animazioni ridotte. In quest'ultimo caso puoi esplorare manualmente i fotogrammi ed esportare una sequenza su richiesta.

## I 12 studi

- **Prisma**: logo cromato, bande oblique, riflessi.
- **Nastro**: tre righe di lettering a scorrimento alternato.
- **Shutter**: pannelli che aprono e chiudono la fotografia.
- **Orbita**: H, HG e HGR su traiettorie concentriche.
- **Segnale**: onde di ritmo e lettering su due righe.
- **Contact**: tre stampe fotografiche in un collage mobile.
- **Annuncio**: story in tre scene, firma / fotografia / invito.
- **Line-up**: manifesto con nomi modificabili in sequenza.
- **Recap**: quattro scene fotografiche con apertura e chiusura.
- **Intro**: costruzione del logo per l'apertura di un video.
- **Titolo video**: nome e dettaglio sopra una foto, con entrata e uscita.
- **Outro**: firma finale e invito.

Tutti gli studi sono adattabili ai tre formati. Le composizioni fotografiche usano quattro riferimenti selezionati dell'identità Hangover; negli altri preset la selezione della foto non cambia i segni. `Titolo video` è una demo composita su foto, non un file con trasparenza né un editor per montare un video caricato.

## Materiali e provenienza

I contorni HANGOVER, HANG, OVER, H, HG e HGR sono estratti senza modifiche dai file SVG approvati del progetto. Le quattro anteprime fotografiche sono i riferimenti forniti e già presenti nella moodboard (01, 03, 17, 23); gli originali restano intatti. La loro presenza in un concept non prova diritti d'uso commerciale. Prima di pubblicare contenuti dell'evento usa fotografie autorizzate e sostituisci i campi tra parentesi con dati confermati.

Testi di servizio: Arial/Helvetica e monospace di sistema. Nessun font esterno incluso o servizio a pagamento. Questo pacchetto contiene template web/JSON; non contiene progetti nativi After Effects, Premiere o CapCut.

## Sorgenti e manutenzione

`motion-data.js`, `motion-engine.js`, `motion-lab.js`, `motion-lab.css` sono i sorgenti dello studio nel sito. `source/motion/build-data.py` aggiorna il pacchetto di vettori, immagini e CSS. `source/motion/build-kit.cjs` ricostruisce il kit autonomo.

Riferimenti tecnici primari: [Canvas captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream), [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), [formati supportati](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static).
