import type {ContentRecord} from "./content";

export const fightFormats=["1 gegen 1","2 gegen 2"];
export const fightStates=["Geplant","Abgeschlossen","Abgesagt"];
export const fightRoles=["Hauptkampf","Co-Hauptkampf","Hauptprogramm","Vorkämpfe"];
export const fightOutcomes=["Rote Ecke","Blaue Ecke","Unentschieden","No Contest"];
export const fightMethods=["KO","TKO","Submission","Punkte","Disqualifikation","Sonstiges"];
const value=(r:ContentRecord,key:string)=>String(r.data[key]??"");
export const isTeamFight=(r:ContentRecord)=>r.data.format==="2 gegen 2";
export function cornerIds(r:ContentRecord,side:"A"|"B"){return [value(r,`fighter${side}`),...(isTeamFight(r)?[value(r,`fighter${side}2`)]:[])];}
export const participantIds=(r:ContentRecord)=>[...cornerIds(r,"A"),...cornerIds(r,"B")].filter(Boolean);
export function cornerName(r:ContentRecord,side:"A"|"B",records:ContentRecord[]){return cornerIds(r,side).map(id=>{const athlete=records.find(x=>x.kind==="fighters"&&x.id===id);return athlete?value(athlete,"name"):"Wird angekündigt";}).join(" & ");}
export function fightState(r:ContentRecord){return value(r,"fightStatus")||(r.data.resultConfirmed||r.data.result?"Abgeschlossen":"Geplant");}
export function fightRole(r:ContentRecord){return value(r,"cardRole")||(/^(main event|hauptkampf)$/i.test(value(r,"name").trim())?"Hauptkampf":value(r,"name"));}
export function fightResult(r:ContentRecord,records:ContentRecord[]){
 if(fightState(r)==="Abgesagt")return "";
 if(r.data.resultOutcome){
  if(!r.data.resultConfirmed||fightState(r)!=="Abgeschlossen")return "";
  const outcome=value(r,"resultOutcome");
  const winner=outcome==="Rote Ecke"||outcome==="Blaue Ecke"?`${isTeamFight(r)?"Teamsieg":"Sieg"}: ${cornerName(r,outcome==="Rote Ecke"?"A":"B",records)}`:outcome;
  return [winner,value(r,"resultMethod"),r.data.resultRound?`Runde ${value(r,"resultRound")}`:"",value(r,"resultTime")].filter(Boolean).join(" · ");
 }
 return value(r,"result");
}
export function validateFight(r:ContentRecord){
 const d=r.data;
 for(const [key,options] of [["format",fightFormats],["fightStatus",fightStates],["cardRole",fightRoles],["resultOutcome",fightOutcomes],["resultMethod",fightMethods]] as const){if(d[key]&&!options.includes(String(d[key])))throw new Error(`Ungültige Auswahl: ${key}.`);}
 const ids=participantIds(r);
 if(new Set(ids).size!==ids.length)throw new Error("Jeder Athlet darf nur einmal in einer Paarung vorkommen.");
 if(!isTeamFight(r)&&(d.fighterA2||d.fighterB2))throw new Error("Zusätzliche Athleten benötigen das Format 2 gegen 2.");
 if(d.resultConfirmed!==undefined&&typeof d.resultConfirmed!=="boolean")throw new Error("Ergebnisbestätigung muss ein Schalter sein.");
 if(d.resultRound!==undefined&&d.resultRound!==""&&(!Number.isInteger(Number(d.resultRound))||Number(d.resultRound)<1||Number(d.resultRound)>Number(d.rounds||15)))throw new Error("Die Ergebnisrunde muss innerhalb der angesetzten Runden liegen.");
 if(d.resultTime){if(!/^\d{1,2}:[0-5]\d$/.test(String(d.resultTime)))throw new Error("Ergebniszeit bitte als Minuten:Sekunden eingeben.");const [m,s]=String(d.resultTime).split(":").map(Number);if(!d.resultRound||m*60+s>Number(d.minutes||10)*60)throw new Error("Ergebniszeit benötigt eine Runde und darf die Rundendauer nicht überschreiten.");}
 if(fightState(r)==="Abgesagt"&&(d.resultConfirmed||d.resultOutcome||d.result))throw new Error("Ein abgesagter Kampf kann kein Ergebnis haben. Bitte Ergebnisangaben entfernen.");
 if(d.resultConfirmed&&(!d.resultOutcome||fightState(r)!=="Abgeschlossen"))throw new Error("Bestätigte Ergebnisse benötigen einen Ausgang und den Kampfstatus Abgeschlossen.");
 if(r.status==="published"&&d.resultOutcome&&!d.resultConfirmed)throw new Error("Unbestätigte Ergebnisse bitte als Entwurf speichern oder vor der Veröffentlichung bestätigen.");
 if(r.status==="published"&&fightState(r)==="Abgeschlossen"&&!(d.resultOutcome?d.resultConfirmed:d.result))throw new Error("Bitte das Ergebnis bestätigen, bevor der Kampf als abgeschlossen veröffentlicht wird.");
 if(r.status==="published"&&d.result&&fightState(r)!=="Abgeschlossen")throw new Error("Ein veröffentlichter Ergebnistext benötigt den Kampfstatus Abgeschlossen.");
 if(d.resultConfirmed&&isTeamFight(r)&&ids.length!==4)throw new Error("Ein bestätigtes Teamergebnis benötigt alle vier Athleten.");
}
