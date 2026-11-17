#!/usr/bin/env python3
"""Agente genérico No Network Cause. Requer Python 3; sem dependências externas.

SOURCE_URL: endpoint JSON autorizado do roteador/NMS dentro da rede.
BRIDGE_URL: URL base do Cloudflare Worker.
INGEST_TOKEN: mesmo secret configurado no Worker.
SOURCE_BEARER_TOKEN: opcional.
POLL_SECONDS: padrão 30, mínimo 15.
SECTOR: identificação do setor.
"""
import json, os, time, urllib.request

SOURCE_URL=os.environ["SOURCE_URL"]
BRIDGE_URL=os.environ["BRIDGE_URL"].rstrip("/")
INGEST_TOKEN=os.environ["INGEST_TOKEN"]
SOURCE_TOKEN=os.getenv("SOURCE_BEARER_TOKEN","")
INTERVAL=max(15,int(os.getenv("POLL_SECONDS","30")))
SECTOR=os.getenv("SECTOR","Roteador / setor principal")

def get_json(url,token=""):
    headers={"Accept":"application/json"}
    if token: headers["Authorization"]="Bearer "+token
    req=urllib.request.Request(url,headers=headers,method="GET")
    with urllib.request.urlopen(req,timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))

def post_json(url,token,payload):
    body=json.dumps(payload).encode("utf-8")
    req=urllib.request.Request(url,data=body,method="POST",headers={
        "Content-Type":"application/json","Authorization":"Bearer "+token})
    with urllib.request.urlopen(req,timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))

def main():
    print("No Network Cause Agent iniciado. Ctrl+C para encerrar.")
    while True:
        started=time.time()
        try:
            source=get_json(SOURCE_URL,SOURCE_TOKEN)
            metrics=source.get("metrics",source) if isinstance(source,dict) else None
            if not isinstance(metrics,dict): raise ValueError("A API não retornou objeto JSON.")
            payload=dict(metrics)
            payload.setdefault("sector",SECTOR)
            payload.setdefault("timestamp",time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()))
            print("Enviado:",post_json(BRIDGE_URL+"/ingest",INGEST_TOKEN,payload))
        except Exception as exc:
            print("Falha na coleta/envio:",str(exc))
        time.sleep(max(1,INTERVAL-(time.time()-started)))

if __name__=="__main__": main()
