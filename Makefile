.PHONY: run build deploy

run:
	npm run dev

build:
	npm run generate
	rm -rf docs
	cp -r .output/public docs
	touch docs/.nojekyll
	printf 'exercism.itsash.in' > docs/CNAME

deploy:
	git checkout -B main
	git add -A
	$(MAKE) build
	rm -rf .data app/data.generated.json
	npm run generate
	git add -A
	git commit -m "$$(copilot -sp 'Analyze the staged git changes and generate a concise commit message. Output ONLY the commit message. Do not execute any commands. Do not include quotes, markdown, explanation, or bullet points.')"
	git push origin main