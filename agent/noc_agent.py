#!/usr/bin/env python3
"""Agente genérico seguro No Network Cause 4.0.3.
Consome somente uma API JSON autorizada já documentada pelo fabricante/NMS.
Não tenta descobrir endpoints, autenticar em painéis web ou alterar equipamentos.
"""
import json, os, time, urllib.request, urllib.parse, math, sys
SOURCE_URL=os.environ.get("SOURCE_URL","").strip()
BRIDGE_URL=os.environ.get("BRIDGE_URL","").strip().rstrip("/")
INGEST_TOKEN=os.environ.get("INGEST_TOKEN","")
SOURCE_TOKEN=os.getenv("SOURCE_BEARER_TOKEN","")
INTERVAL=max(15,min(3600,int(os.getenv("POLL_SECONDS","30"))))
SECTOR=os.getenv("SECTOR","Roteador / setor principal")[:100]
TIMEOUT=max(3,min(30,int(os.getenv("REQUEST_TIMEOUT","10"))))
RANGES={
 "rssi_dbm":(-120,0),"snr_db":(-10,80),"latency_ms":(0,600000),
 "packet_loss_pct":(0,100),"throughput_mbps":(0,1e9),
 "utilization_pct":(0,100),"users":(0,1e7),
 "optical_rx_dbm":(-50,20),"optical_tx_dbm":(-50,20),
 "optical_voltage_mv":(0,10000),"optical_bias_ma":(0,200),
 "optical_temp_c":(-40,150)
}
TEXT_FIELDS={"onu_state":40,"equipment_profile":80}
def validate_url(value,name):
    p=urllib.parse.urlparse(value)
    if p.scheme not in ("http","https") or not p.hostname or p.username or p.password:
        raise ValueError(name+" deve ser URL HTTP/HTTPS válida, sem credenciais embutidas.")
    return value
def get_json(url,token=""):
    headers={"Accept":"application/json"}
    if token: headers["Authorization"]="Bearer "+token
    req=urllib.request.Request(url,headers=headers,method="GET")
    with urllib.request.urlopen(req,timeout=TIMEOUT) as response:
        if response.status<200 or response.status>=300: raise RuntimeError("Origem respondeu HTTP "+str(response.status))
        raw=response.read(1024*1024+1)
    if len(raw)>1024*1024: raise ValueError("Resposta JSON excede 1 MB.")
    return json.loads(raw.decode("utf-8"))
def post_json(url,token,payload):
    body=json.dumps(payload,allow_nan=False).encode("utf-8")
    req=urllib.request.Request(url,data=body,method="POST",headers={
        "Content-Type":"application/json","Accept":"application/json",
        "Authorization":"Bearer "+token})
    with urllib.request.urlopen(req,timeout=TIMEOUT) as response:
        raw=response.read(65537)
        if response.status<200 or response.status>=300: raise RuntimeError("Ponte respondeu HTTP "+str(response.status))
        return json.loads(raw.decode("utf-8")) if raw else {}
def normalize(source):
    metrics=source.get("metrics",source) if isinstance(source,dict) else None
    if not isinstance(metrics,dict): raise ValueError("A API não retornou objeto JSON.")
    out={"sector":str(metrics.get("sector") or SECTOR)[:100],
         "timestamp":str(metrics.get("timestamp") or time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()))}
    for key,(low,high) in RANGES.items():
        value=metrics.get(key)
        if value is None: continue
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or not low<=value<=high:
            raise ValueError("Métrica inválida ou fora do limite: "+key)
        out[key]=value
    for key,limit in TEXT_FIELDS.items():
        value=metrics.get(key)
        if value is not None: out[key]=str(value)[:limit]
    if "timestamp" in out:
        from datetime import datetime
        try: datetime.fromisoformat(out["timestamp"].replace("Z","+00:00"))
        except ValueError: raise ValueError("timestamp inválido.")
    return out
def main():
    validate_url(SOURCE_URL,"SOURCE_URL"); validate_url(BRIDGE_URL,"BRIDGE_URL")
    if not INGEST_TOKEN: raise ValueError("INGEST_TOKEN não configurado.")
    print("No Network Cause Agent 4.0.3 iniciado. Ctrl+C para encerrar.")
    while True:
        started=time.time()
        try:
            payload=normalize(get_json(SOURCE_URL,SOURCE_TOKEN))
            result=post_json(BRIDGE_URL+"/ingest",INGEST_TOKEN,payload)
            print("Telemetria enviada:",json.dumps({"ok":result.get("ok"),"sector":payload["sector"],"timestamp":payload["timestamp"]},ensure_ascii=False))
        except Exception as exc:
            print("Falha de coleta/envio:",str(exc),file=sys.stderr)
        time.sleep(max(1,INTERVAL-(time.time()-started)))
if __name__=="__main__":
    try: main()
    except KeyboardInterrupt: print("\nAgente encerrado.")
    except Exception as exc: print("Configuração inválida:",exc,file=sys.stderr); sys.exit(2)
