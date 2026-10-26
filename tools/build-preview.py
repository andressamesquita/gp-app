"""Monta a prévia web num único HTML: fontes embutidas, pacote JS inline e moldura de celular.
Uso: npx expo export --platform web --output-dir dist && python3 tools/build-preview.py dist saida.html
"""
import base64, glob, os, sys

dist, out = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)

fonts = ''
for w in ['400Regular', '500Medium', '600SemiBold', '700Bold']:
    path = glob.glob(f'{root}/node_modules/@expo-google-fonts/montserrat/{w}/*.ttf')[0]
    b = base64.b64encode(open(path, 'rb').read()).decode()
    fonts += f"@font-face{{font-family:'Montserrat_{w}';src:url(data:font/ttf;base64,{b}) format('truetype');font-display:block}}\n"

bundle = open(glob.glob(f'{dist}/_expo/static/js/web/entry-*.js')[0]).read().replace('</script', '<\\/script')

# Imagens do app (banners etc.) embutidas como data URI, para a prévia funcionar num arquivo só.
import re
MIME = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
def _inline(m):
    rel = m.group(1)
    path = os.path.join(dist, rel.lstrip('/'))
    if not os.path.exists(path):
        return m.group(0)
    ext = rel.rsplit('.', 1)[-1].lower()
    return '"data:%s;base64,%s"' % (MIME[ext], base64.b64encode(open(path, 'rb').read()).decode())
bundle = re.sub(r'"(/assets/assets/[^"]+\.(?:jpe?g|png|webp))"', _inline, bundle)

SIG = '<svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="4.3" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="8.6" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="12.9" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>'
WIFI = '<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 1 4.3a10 10 0 0 1 14 0z" fill="currentColor"/></svg>'
BAT = '<svg width="24" height="12" viewBox="0 0 24 12"><rect x=".5" y=".5" width="20" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2.5" y="2.5" width="12" height="7" rx="1.5" fill="currentColor"/><rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor"/></svg>'

page = f'''<title>Gov.pi Cidadão App</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style id="govpi-fonts">{fonts}</style>
<style>
/* Moldura de celular Android à esquerda, roteiro de teste à direita; no celular, só o app em tela cheia. */
:root{{--bg:#E6EBF2;--panel:#FFFFFF;--ink:#14233A;--muted:#4A5A70;--line:#D3DCE8;--accent:#034EA2;--frame:#14233A}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#0D1624;--panel:#152236;--ink:#E6EDF6;--muted:#A3B2C7;--line:#2A3B55;--accent:#8CBDF2;--frame:#05090F;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#0D1624;--panel:#152236;--ink:#E6EDF6;--muted:#A3B2C7;--line:#2A3B55;--accent:#8CBDF2;--frame:#05090F;color-scheme:dark}}
html,body{{height:100%}}
body{{background:var(--bg);color:var(--ink);font-family:'Montserrat_500Medium',system-ui,sans-serif;overflow:hidden}}
.stage{{height:100%;display:flex;gap:40px;align-items:center;justify-content:center;padding-block:20px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));box-sizing:border-box}}
.phone{{flex:none;width:412px;height:min(890px,100%);border-radius:40px;background:var(--frame);padding:10px;box-sizing:border-box;box-shadow:0 30px 60px -20px rgba(10,25,50,.45)}}
.screen{{position:relative;width:100%;height:100%;border-radius:31px;overflow:hidden;background:#FFFFFF;transform:translateZ(0);display:flex;flex-direction:column}}
.sbar{{flex:none;height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:#FFFFFF;color:#14233A;font-family:'Montserrat_600SemiBold',system-ui,sans-serif;font-size:13px;transition:background .2s,color .2s}}
.sbar svg{{display:block}}.sbar .ic{{display:flex;gap:6px;align-items:center}}
#root{{display:flex;flex:1;min-height:0}}
/* Celular não mostra barra de rolagem fixa: esconde as barras do navegador dentro do app */
#root *{{scrollbar-width:none}}#root *::-webkit-scrollbar{{display:none;width:0;height:0}}
.guide{{width:320px;min-width:0;display:flex;flex-direction:column;gap:14px}}
.guide h1{{font-family:'Montserrat_700Bold',system-ui,sans-serif;font-size:22px;line-height:1.2;margin:0;text-wrap:balance}}
.guide p{{margin:0;font-size:14px;line-height:1.55;color:var(--muted)}}
.guide ol{{margin:0;padding:16px 16px 16px 34px;background:var(--panel);border:1px solid var(--line);border-radius:14px;display:flex;flex-direction:column;gap:8px;font-size:13.5px;line-height:1.45}}
.guide b{{font-family:'Montserrat_600SemiBold',system-ui,sans-serif;font-weight:normal;color:var(--ink)}}
.tag{{align-self:flex-start;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-family:'Montserrat_600SemiBold',system-ui,sans-serif}}
@media (max-width:820px){{.guide{{display:none}}}}
@media (max-width:480px){{.stage{{padding:0}}.phone{{width:100%;height:100%;border-radius:0;padding:0;box-shadow:none}}.screen{{border-radius:0}}.sbar{{display:none}}}}
</style>
<div class="stage">
  <div class="phone"><div class="screen">
    <div class="sbar" id="sbar" aria-hidden="true"><span>17:22</span><span class="ic">{SIG}{WIFI}{BAT}</span></div>
    <div id="root"></div>
  </div></div>
  <aside class="guide">
    <span class="tag">Prévia · React Native + Expo</span>
    <h1>App Gov.pi Cidadão</h1>
    <p>Esta é a mesma base de código do app Android e iOS, rodando no navegador. Para ver no celular de verdade, use o Expo Go.</p>
    <ol>
      <li>O app abre no <b>Assistente Gov.pi</b>, sem precisar entrar.</li>
      <li>Toque em <b>Renovar minha CNH</b> e acompanhe o carregamento em etapas.</li>
      <li>No cartão de login, toque em <b>Entrar</b>. A conversa continua de onde parou.</li>
      <li><b>Confirme</b> a renovação e toque em <b>Acompanhar</b>.</li>
      <li>Veja o <b>Início</b>: busca que abre o assistente, banners e serviços mais acessados.</li>
      <li>Na <b>Área do cidadão</b>, use os atalhos em grade e, no fim, o <b>Modo protótipo</b>.</li>
    </ol>
    <p>Dados simulados da Ana Souza. Nada é enviado a sistemas reais.</p>
  </aside>
</div>
<script>window.__govpiStatus=function(bg,st){{var b=document.getElementById('sbar');if(!b)return;b.style.background=bg;b.style.color=st==='light'?'#FFFFFF':'#14233A'}};
try{{if(location.pathname!=='/'){{history.replaceState(null,'','/')}}}}catch(e){{}}</script>
<script>{bundle}</script>
'''
open(out, 'w').write(page)
print(out, len(page) // 1024, 'KB')
