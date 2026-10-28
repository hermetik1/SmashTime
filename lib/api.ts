let csrf="";
export async function api(action:string,body?:unknown,signal?:AbortSignal){
 const endpoint=process.env.NEXT_PUBLIC_CMS_API==="vercel"?"/api/cms":"/api/index.php";
 const response=await fetch(`${endpoint}?action=${encodeURIComponent(action)}`,{method:body===undefined?"GET":"POST",credentials:"same-origin",headers:body===undefined?{}:{"Content-Type":"application/json","X-CSRF-Token":csrf},body:body===undefined?undefined:JSON.stringify(body),cache:"no-store",signal});
 const result=await response.json().catch(()=>({error:"Der Server hat keine gültige Antwort geliefert."}));
 if(result.csrf)csrf=result.csrf;
 if(!response.ok)throw new Error(result.error||"Die Anfrage konnte nicht abgeschlossen werden.");
 return result;
}
