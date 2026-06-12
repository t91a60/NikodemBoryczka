document.addEventListener("DOMContentLoaded", () => {
    const username = "t91a60";
    
    // Repositories we want to fetch stats for
    const repos = ["osp-logbook", "AlkoRater", "PurrOS"];

    repos.forEach(repo => {
        fetch(`https://api.github.com/repos/${username}/${repo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Repo ${repo} not found or private.`);
                }
                return response.json();
            })
            .then(data => {
                const starsElements = document.querySelectorAll(`.github-stars-${repo.toLowerCase()}`);
                const forksElements = document.querySelectorAll(`.github-forks-${repo.toLowerCase()}`);
                
                starsElements.forEach(el => {
                    el.innerHTML = `⭐ ${data.stargazers_count}`;
                    el.style.display = "inline-block";
                });
                
                forksElements.forEach(el => {
                    if(data.forks_count > 0) {
                        el.innerHTML = `🍴 ${data.forks_count}`;
                        el.style.display = "inline-block";
                    }
                });
            })
            .catch(error => {
                console.log(`GitHub API note for ${repo}:`, error.message);
                // Silently fail for private/missing repos (like PurrOS if not published yet)
            });
    });
});
