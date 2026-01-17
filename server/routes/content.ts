type Headers = Record<string, string>;

export async function contentRoutes(
    req: Request,
    url: URL,
    corsHeaders: Headers
): Promise<Response> {
    const path = url.pathname.replace('/api/content', '');

    if (req.method === 'GET') {
        if (path === '/courses' || path === '/courses/') {
            return getCourses(corsHeaders);
        }

        const courseMatch = path.match(/^\/courses\/([^/]+)$/);
        if (courseMatch) {
            return getCourse(courseMatch[1], corsHeaders);
        }

        const moduleMatch = path.match(
            /^\/courses\/([^/]+)\/modules\/([^/]+)$/
        );
        if (moduleMatch) {
            return getModule(moduleMatch[1], moduleMatch[2], corsHeaders);
        }

        const lessonMatch = path.match(
            /^\/courses\/([^/]+)\/modules\/([^/]+)\/lessons\/([^/]+)$/
        );
        if (lessonMatch) {
            return getLesson(
                lessonMatch[1],
                lessonMatch[2],
                lessonMatch[3],
                corsHeaders
            );
        }

        const exerciseMatch = path.match(
            /^\/courses\/([^/]+)\/modules\/([^/]+)\/exercises\/([^/]+)$/
        );
        if (exerciseMatch) {
            return getExercise(
                exerciseMatch[1],
                exerciseMatch[2],
                exerciseMatch[3],
                corsHeaders
            );
        }
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

interface Course {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    estimatedHours: number;
    modules: string[];
}

async function getCourses(headers: Headers): Promise<Response> {
    const coursesDir = './content/courses';
    const courses: Course[] = [];

    // Dynamically read all course directories
    const entries = await Array.fromAsync(
        new Bun.Glob('*/course.json').scan({ cwd: coursesDir })
    );

    for (const entry of entries) {
        const courseFile = Bun.file(`${coursesDir}/${entry}`);
        try {
            const course = await courseFile.json() as Course;
            // Validate required fields
            if (course.id && course.title) {
                courses.push(course);
            } else {
                console.warn(`Skipping malformed course: ${entry} (missing id or title)`);
            }
        } catch (err) {
            console.error(`Failed to parse course: ${entry}`, err);
            // Continue to next course instead of failing entirely
        }
    }

    // Sort by title for consistent ordering
    courses.sort((a, b) => a.title.localeCompare(b.title));

    return new Response(JSON.stringify(courses), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

async function getCourse(
    courseId: string,
    headers: Headers
): Promise<Response> {
    const courseFile = Bun.file(`./content/courses/${courseId}/course.json`);

    if (!(await courseFile.exists())) {
        return new Response(JSON.stringify({ error: 'Course not found' }), {
            status: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
        });
    }

    const course = await courseFile.json();
    return new Response(JSON.stringify(course), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

async function getModule(
    courseId: string,
    moduleId: string,
    headers: Headers
): Promise<Response> {
    const moduleFile = Bun.file(
        `./content/courses/${courseId}/modules/${moduleId}/module.json`
    );

    if (!(await moduleFile.exists())) {
        return new Response(JSON.stringify({ error: 'Module not found' }), {
            status: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
        });
    }

    const module = await moduleFile.json();
    return new Response(JSON.stringify(module), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

async function getLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    headers: Headers
): Promise<Response> {
    const lessonFile = Bun.file(
        `./content/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}.md`
    );

    if (!(await lessonFile.exists())) {
        return new Response(JSON.stringify({ error: 'Lesson not found' }), {
            status: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
        });
    }

    const content = await lessonFile.text();
    const { frontMatter, body } = parseFrontMatter(content);

    return new Response(
        JSON.stringify({
            id: lessonId,
            ...frontMatter,
            content: body,
        }),
        {
            headers: { ...headers, 'Content-Type': 'application/json' },
        }
    );
}

async function getExercise(
    courseId: string,
    moduleId: string,
    exerciseId: string,
    headers: Headers
): Promise<Response> {
    const exerciseFile = Bun.file(
        `./content/courses/${courseId}/modules/${moduleId}/exercises/${exerciseId}.json`
    );

    if (!(await exerciseFile.exists())) {
        return new Response(JSON.stringify({ error: 'Exercise not found' }), {
            status: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
        });
    }

    const exercise = await exerciseFile.json();
    return new Response(JSON.stringify(exercise), {
        headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

function parseFrontMatter(content: string): {
    frontMatter: Record<string, unknown>;
    body: string;
} {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontMatterMatch) {
        return { frontMatter: {}, body: content };
    }

    const [, frontMatterStr, body] = frontMatterMatch;
    const frontMatter: Record<string, unknown> = {};

    for (const line of frontMatterStr.split('\n')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value: unknown = line.slice(colonIndex + 1).trim();

            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (!isNaN(Number(value))) value = Number(value);

            frontMatter[key] = value;
        }
    }

    return { frontMatter, body: body.trim() };
}
